/**
 * Customer detail page — the full matchmaking workspace for a single customer.
 * Features: biodata grid (28 fields), AI match insights, top matches with scoring,
 * send match confirmation with personalized intro, meeting/call notes, and
 * compatibility summary with strengths/considerations.
 */
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import profiles from '@/data/profiles';
import { getMatchesForCustomer, getCompatibilitySummary } from '@/lib/matching';
import { getMatchInsights, generatePersonalizedIntro, getConversationStarters } from '@/lib/ai';
import Avatar from '@/components/Avatar';
import StatusBadge, { statusLabels } from '@/components/StatusBadge';
import BiodataGrid from '@/components/BiodataGrid';
import MatchCard from '@/components/MatchCard';
import Toast from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';
import ProfileDetailModal from '@/components/ProfileDetailModal';

export default function CustomerDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [viewedProfile, setViewedProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  /** Load customer profile, matches, status overrides, and notes. */
  useEffect(() => {
    const storedStatuses = JSON.parse(
      localStorage.getItem('customerStatuses') || '{}'
    );
    const profile = profiles.find((p) => p.id === params.id);
    if (!profile) {
      navigate('/dashboard');
      return;
    }
    if (storedStatuses[profile.id]) {
      profile.status = storedStatuses[profile.id];
    }
    setCustomer({ ...profile });

    const result = getMatchesForCustomer(profile.id);
    setMatches(result);

    const storedNotes = JSON.parse(
      localStorage.getItem('customerNotes') || '{}'
    );
    setNotes(storedNotes[profile.id] || []);
  }, [params.id, navigate]);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleSendMatch(match) {
    setSelectedMatch(match);
    setShowMatchModal(true);
  }

  /** Persists the match to localStorage and shows confirmation. */
  function confirmSendMatch() {
    const sent = JSON.parse(
      localStorage.getItem('sentMatches') || '[]'
    );
    sent.push({
      customerId: customer.id,
      matchId: selectedMatch.profile.id,
      timestamp: Date.now(),
    });
    localStorage.setItem('sentMatches', JSON.stringify(sent));
    setShowMatchModal(false);
    showToast(
      `Match sent! Introduced ${customer.firstName} to ${selectedMatch.profile.firstName}`
    );
  }

  /** Updates customer status and persists to localStorage. */
  function handleStatusChange(newStatus) {
    const updated = { ...customer, status: newStatus };
    setCustomer(updated);
    const storedStatuses = JSON.parse(
      localStorage.getItem('customerStatuses') || '{}'
    );
    storedStatuses[updated.id] = newStatus;
    localStorage.setItem(
      'customerStatuses',
      JSON.stringify(storedStatuses)
    );
    showToast(`Status updated to "${statusLabels[newStatus]}"`);
  }

  function handleViewProfile(match) {
    setViewedProfile(match.profile);
  }

  /** Records a timestamped meeting/call note. */
  function handleAddNote() {
    if (!newNote.trim()) return;
    const entry = { text: newNote.trim(), timestamp: Date.now() };
    const updatedNotes = [...notes, entry];
    setNotes(updatedNotes);
    setNewNote('');
    const allNotes = JSON.parse(
      localStorage.getItem('customerNotes') || '{}'
    );
    allNotes[customer.id] = updatedNotes;
    localStorage.setItem('customerNotes', JSON.stringify(allNotes));
    showToast('Note saved');
  }

  /** AI-generated insights for the top match. */
  const matchInsights = useMemo(() => {
    if (!customer || matches.length === 0) return [];
    const top = matches[0];
    return getMatchInsights(customer, top.profile, top.score);
  }, [customer, matches]);

  /** Compatibility summary for the top match (strengths / considerations). */
  const compatibilitySummary = useMemo(() => {
    if (!customer || matches.length === 0) return null;
    return getCompatibilitySummary(customer, matches[0]);
  }, [customer, matches]);

  /** Personalized intro for the currently selected match. */
  const personalizedIntro = useMemo(() => {
    if (!customer || !selectedMatch) return '';
    return generatePersonalizedIntro(customer, selectedMatch.profile);
  }, [customer, selectedMatch]);

  /** Conversation starters for the top match. */
  const conversationStarters = useMemo(() => {
    if (!customer || matches.length === 0) return [];
    return getConversationStarters(customer, matches[0].profile);
  }, [customer, matches]);

  if (!customer) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1 transition-colors"
      >
        ← Back to Dashboard
      </button>

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===== LEFT COLUMN: Customer Details ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="tdc-card p-6">
            <div className="flex items-start gap-5">
              <Avatar
                firstName={customer.firstName}
                lastName={customer.lastName}
                size="lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </h1>
                    <p className="text-gray-500">
                      {customer.age} yrs · {customer.city},{' '}
                      {customer.country}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge
                      status={customer.status}
                      size="lg"
                    />
                    <select
                      value={customer.status}
                      onChange={(e) =>
                        handleStatusChange(e.target.value)
                      }
                      className="text-xs px-2 py-1 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-tdc-gold-400 outline-none transition-all"
                    >
                      {Object.entries(statusLabels).map(
                        ([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biodata Section (28 fields for Indian matchmaking) */}
          <div className="tdc-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 tdc-section-title">
              Biodata
            </h2>
            <BiodataGrid
              columns={2}
              fields={[
                { label: 'First Name', value: customer.firstName },
                { label: 'Last Name', value: customer.lastName },
                {
                  label: 'Gender',
                  value:
                    customer.gender === 'male'
                      ? 'Male'
                      : 'Female',
                },
                {
                  label: 'Date of Birth',
                  value: customer.dateOfBirth,
                },
                { label: 'Age', value: customer.age },
                { label: 'Country', value: customer.country },
                { label: 'City', value: customer.city },
                {
                  label: 'Height',
                  value: `${customer.height} cm`,
                },
                { label: 'Email', value: customer.email },
                {
                  label: 'Phone',
                  value: customer.phoneNumber,
                },
                {
                  label: 'Education',
                  value: `${customer.degree}, ${customer.undergraduateCollege}`,
                },
                {
                  label: 'Income',
                  value: `₹${(customer.income / 100000).toFixed(
                    1
                  )} LPA`,
                },
                {
                  label: 'Company',
                  value: customer.currentCompany,
                },
                {
                  label: 'Designation',
                  value: customer.designation,
                },
                {
                  label: 'Marital Status',
                  value: customer.maritalStatus,
                },
                {
                  label: 'Languages',
                  value: customer.languagesKnown.join(', '),
                },
                { label: 'Siblings', value: customer.siblings },
                { label: 'Caste', value: customer.caste },
                { label: 'Religion', value: customer.religion },
                { label: 'Manglik', value: customer.manglik },
                { label: 'Diet', value: customer.diet },
                { label: 'Smoking', value: customer.smoking },
                { label: 'Drinking', value: customer.drinking },
                {
                  label: 'Family Type',
                  value: customer.familyType,
                },
                {
                  label: 'Hobbies',
                  value: customer.hobbies.join(', '),
                },
                { label: 'Want Kids', value: customer.wantKids },
                {
                  label: 'Open to Relocate',
                  value: customer.openToRelocate,
                },
                {
                  label: 'Open to Pets',
                  value: customer.openToPets,
                },
              ]}
            />
          </div>

          {/* About Section */}
          <div className="tdc-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 tdc-section-title">
              About
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {customer.about}
            </p>
          </div>

          {/* Meeting & Call Notes */}
          <div className="tdc-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 tdc-section-title">
              Meeting & Call Notes
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleAddNote()
                }
                placeholder="Record a note from a meeting or call..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tdc-gold-400 outline-none transition-all text-sm"
              />
              <button
                onClick={handleAddNote}
                className="tdc-btn tdc-btn-sm"
              >
                Add Note
              </button>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                <div className="text-2xl mb-2">📝</div>
                <p className="text-sm">
                  No notes yet. Start recording meeting or call
                  notes above.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[...notes].reverse().map((note, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-lg p-3 transition-colors hover:bg-gray-100/50"
                  >
                    <p className="text-sm text-gray-700">
                      {note.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(note.timestamp).toLocaleDateString(
                        'en-IN',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== RIGHT COLUMN: AI & Matches ===== */}
        <div className="space-y-6">
          {/* AI Match Insights */}
          <div
            className="rounded-xl p-5"
            style={{
              background: 'linear-gradient(135deg, #e8f2f0, #f9efe1)',
              border: '1px solid #ebc796',
            }}
          >
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>🤖</span> AI Match Insights
            </h2>
            {matchInsights.length > 0 ? (
              <ul className="space-y-2">
                {matchInsights.map((insight, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-700 flex gap-2"
                  >
                    <span className="text-tdc-gold-600 mt-0.5 shrink-0">
                      •
                    </span>
                    {insight}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                No matches available yet
              </p>
            )}
          </div>

          {/* Compatibility Summary */}
          {compatibilitySummary && (
            <div className="tdc-card p-5">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📊</span> Compatibility Summary
              </h2>
              <p className="text-sm text-gray-600 italic mb-3 leading-relaxed">
                {compatibilitySummary.overallVerdict}
              </p>

              {compatibilitySummary.strengths.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-tdc-green-700 uppercase tracking-wider font-medium mb-1">
                    ✅ Strengths
                  </p>
                  <ul className="space-y-1">
                    {compatibilitySummary.strengths.map(
                      (s, i) => (
                        <li
                          key={i}
                          className="text-xs text-gray-600 flex gap-1.5"
                        >
                          <span className="text-tdc-green-500">
                            +
                          </span>
                          {s}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {compatibilitySummary.considerations.length > 0 && (
                <div>
                  <p className="text-xs text-tdc-gold-600 uppercase tracking-wider font-medium mb-1">
                    ⚠️ Considerations
                  </p>
                  <ul className="space-y-1">
                    {compatibilitySummary.considerations.map(
                      (c, i) => (
                        <li
                          key={i}
                          className="text-xs text-gray-600 flex gap-1.5"
                        >
                          <span className="text-tdc-gold-500">
                            •
                          </span>
                          {c}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Conversation Starters */}
          {conversationStarters.length > 0 && (
            <div className="tdc-card p-5">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>💬</span> Conversation Starters
              </h2>
              <ul className="space-y-2">
                {conversationStarters.map((starter, i) => (
                  <li
                    key={i}
                    className="text-xs text-gray-600 flex gap-2"
                  >
                    <span className="text-tdc-gold-500 shrink-0 font-bold">
                      {i + 1}.
                    </span>
                    {starter}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Top Matches */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 tdc-section-title">
              <span>🎯</span> Top Matches
            </h2>
            <div className="space-y-3">
              {matches.slice(0, 10).length > 0 ? (
                matches.slice(0, 10).map((match) => (
                  <MatchCard
                    key={match.profile.id}
                    match={match}
                    onSendMatch={handleSendMatch}
                    onViewProfile={handleViewProfile}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm">
                    No matches found for this customer
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Send Match Confirmation Modal */}
      <ConfirmModal
        open={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        onConfirm={confirmSendMatch}
        title="Confirm Match"
        confirmText="✉️ Send Match"
      >
        <div
          className="rounded-xl p-4 mb-4"
          style={{
            background: 'linear-gradient(135deg, #e8f2f0, #f9efe1)',
            border: '1px solid #ebc796',
          }}
        >
          <p className="text-sm font-medium text-gray-700 mb-2">
            Introducing {customer.firstName} {customer.lastName} to{' '}
            {selectedMatch?.profile.firstName}{' '}
            {selectedMatch?.profile.lastName}
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400 text-xs">Match Score</p>
              <p className="font-medium">
                {selectedMatch?.score}/100
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Location</p>
              <p className="font-medium">
                {selectedMatch?.profile.city}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Age</p>
              <p className="font-medium">
                {selectedMatch?.profile.age} yrs
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Profession</p>
              <p className="font-medium">
                {selectedMatch?.profile.designation}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
            Personalized Intro
          </p>
          <p className="text-sm text-gray-700 italic leading-relaxed">
            {personalizedIntro}
          </p>
        </div>
      </ConfirmModal>

      <ProfileDetailModal
        profile={viewedProfile}
        onClose={() => setViewedProfile(null)}
      />
    </div>
  );
}
