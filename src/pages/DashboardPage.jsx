/**
 * Dashboard overview page — the main hub for matchmakers.
 * Displays: analytics cards, search/filter for assigned customers,
 * customer list with status badges, sent match history, and manage modal.
 *
 * On first load, auto-assigns 12 random male profiles as "customers".
 * All state is persisted to localStorage for session continuity.
 */
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import profiles from '@/data/profiles';
import StatusBadge, { statusLabels } from '@/components/StatusBadge';
import Avatar from '@/components/Avatar';
import Toast from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignedIds, setAssignedIds] = useState([]);
  const [sentMatches, setSentMatches] = useState([]);
  const [toast, setToast] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [editIds, setEditIds] = useState([]);

  /** Load assigned customers and sent match history from localStorage. */
  useEffect(() => {
    const stored = localStorage.getItem('assignedCustomers');
    if (stored) {
      setAssignedIds(JSON.parse(stored));
    } else {
      const allIds = profiles
        .filter((p) => p.gender === 'male')
        .map((p) => p.id);
      const shuffled = allIds.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 12);
      localStorage.setItem('assignedCustomers', JSON.stringify(selected));
      setAssignedIds(selected);
    }

    const storedSent = JSON.parse(
      localStorage.getItem('sentMatches') || '[]'
    );
    setSentMatches(storedSent);
  }, []);

  function showToastMsg(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  /** Reassigns 12 random male profiles as the matchmaker's customers. */
  function assignRandom() {
    const allIds = profiles
      .filter((p) => p.gender === 'male')
      .map((p) => p.id);
    const shuffled = allIds.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 12);
    localStorage.setItem('assignedCustomers', JSON.stringify(selected));
    setAssignedIds(selected);
    showToastMsg('Customers reassigned successfully');
  }

  function openManage() {
    setEditIds([...assignedIds]);
    setShowManageModal(true);
  }

  function toggleEditId(id) {
    setEditIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  function saveAssignments() {
    localStorage.setItem('assignedCustomers', JSON.stringify(editIds));
    setAssignedIds(editIds);
    setShowManageModal(false);
    showToastMsg('Customer assignments updated');
  }

  const allMaleProfiles = useMemo(
    () => profiles.filter((p) => p.gender === 'male'),
    []
  );

  const assignedProfiles = useMemo(
    () => allMaleProfiles.filter((p) => assignedIds.includes(p.id)),
    [allMaleProfiles, assignedIds]
  );

  const filteredProfiles = useMemo(
    () =>
      assignedProfiles.filter((p) => {
        const q = search.toLowerCase();
        const matchesSearch =
          !q ||
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q);
        const matchesStatus =
          statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [assignedProfiles, search, statusFilter]
  );

  /** Resolves sent match IDs to full profile objects for display. */
  const resolvedSentMatches = useMemo(
    () =>
      sentMatches
        .map((sm) => {
          const customer = profiles.find(
            (p) => p.id === sm.customerId
          );
          const match = profiles.find((p) => p.id === sm.matchId);
          return { ...sm, customer, match };
        })
        .filter((sm) => sm.customer && sm.match)
        .reverse(),
    [sentMatches]
  );

  const stats = useMemo(() => {
    const total = assignedProfiles.length;
    const byStatus = {};
    for (const p of assignedProfiles) {
      byStatus[p.status] = (byStatus[p.status] || 0) + 1;
    }
    return {
      total,
      sentCount: sentMatches.length,
      activeDiscussions: byStatus.active_discussion || 0,
      closed: byStatus.closed || 0,
    };
  }, [assignedProfiles, sentMatches]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* --- Analytics Cards --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="tdc-card p-4 border-0 transition-all duration-200 hover:shadow-md"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            Total Customers
          </p>
          <p className="text-2xl font-bold text-tdc-green-700 mt-1">
            {stats.total}
          </p>
        </div>
        <div
          className="tdc-card p-4 border-0 transition-all duration-200 hover:shadow-md"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            Matches Sent
          </p>
          <p className="text-2xl font-bold text-tdc-gold-500 mt-1">
            {stats.sentCount}
          </p>
        </div>
        <div
          className="tdc-card p-4 border-0 transition-all duration-200 hover:shadow-md"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            Active Discussions
          </p>
          <p className="text-2xl font-bold text-tdc-green-500 mt-1">
            {stats.activeDiscussions}
          </p>
        </div>
        <div
          className="tdc-card p-4 border-0 transition-all duration-200 hover:shadow-md"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            Closed
          </p>
          <p className="text-2xl font-bold text-gray-700 mt-1">
            {stats.closed}
          </p>
        </div>
      </div>

      {/* --- Customer Section Header --- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-tdc-green-700 tdc-section-title">
              My Customers
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredProfiles.length} of {assignedProfiles.length}{' '}
              customers
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openManage}
              className="tdc-btn tdc-btn-outline tdc-btn-sm"
            >
              Manage
            </button>
            <button
              onClick={assignRandom}
              className="tdc-btn tdc-btn-sm"
            >
              Reassign
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tdc-gold-400 outline-none transition-all"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tdc-gold-400 outline-none bg-white transition-all"
          >
            <option value="all">All Statuses</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Customer Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <Link
              key={profile.id}
              to={`/dashboard/${profile.id}`}
              className="tdc-card p-5 transition-all duration-200 hover:shadow-md hover:border-tdc-gold-400"
            >
              <div className="flex items-start gap-4">
                <Avatar
                  firstName={profile.firstName}
                  lastName={profile.lastName}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <StatusBadge status={profile.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {profile.age} yrs · {profile.city} ·{' '}
                    {profile.maritalStatus}
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5 truncate">
                    {profile.designation} at{' '}
                    {profile.currentCompany}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProfiles.length === 0 && (
          <div className="text-center py-16 text-gray-400 animate-fadeIn">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium text-gray-500">
              {assignedProfiles.length === 0
                ? 'No customers assigned yet'
                : 'No customers match your search'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {assignedProfiles.length === 0
                ? 'Click "Reassign" to get started'
                : 'Try adjusting your filters or search terms'}
            </p>
          </div>
        )}
      </div>

      {/* --- Sent Matches History --- */}
      {resolvedSentMatches.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-tdc-green-900 mb-4 tdc-section-title">
            Sent Matches History
          </h2>
          <div className="tdc-card p-0 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {resolvedSentMatches.slice(0, 20).map((sm, i) => (
                <div
                  key={sm.timestamp + i}
                  className="flex items-center gap-3 p-4 transition-colors hover:bg-gray-50/50"
                >
                  <div className="flex -space-x-2 shrink-0">
                    <Avatar
                      firstName={sm.customer.firstName}
                      lastName={sm.customer.lastName}
                      size="sm"
                    />
                    <div className="w-10 h-10 rounded-full bg-tdc-gold-100 border-2 border-white flex items-center justify-center text-tdc-gold-700 text-xs font-bold z-10">
                      +{sm.match.firstName[0]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">
                        {sm.customer.firstName}{' '}
                        {sm.customer.lastName}
                      </span>
                      {' → '}
                      <span className="font-medium">
                        {sm.match.firstName}{' '}
                        {sm.match.lastName}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(sm.timestamp).toLocaleDateString(
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
                  <Link
                    to={`/dashboard/${sm.customer.id}`}
                    className="text-xs text-tdc-gold-600 hover:text-tdc-gold-700 font-medium shrink-0 transition-colors"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Manage Customers Modal --- */}
      <ConfirmModal
        open={showManageModal}
        onClose={() => setShowManageModal(false)}
        onConfirm={saveAssignments}
        title="Manage Customers"
        confirmText="Save Assignments"
      >
        <p className="text-sm text-gray-500 mb-3">
          Select the customers you want assigned to you (
          {editIds.length} selected)
        </p>
        <div className="max-h-80 overflow-y-auto space-y-1">
          {allMaleProfiles.map((p) => (
            <label
              key={p.id}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                editIds.includes(p.id)
                  ? 'bg-tdc-gold-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={editIds.includes(p.id)}
                onChange={() => toggleEditId(p.id)}
                className="accent-tdc-gold-400"
              />
              <Avatar
                firstName={p.firstName}
                lastName={p.lastName}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  {p.firstName} {p.lastName}
                </p>
                <p className="text-xs text-gray-400">
                  {p.age} yrs · {p.city}
                </p>
              </div>
              <StatusBadge status={p.status} />
            </label>
          ))}
        </div>
      </ConfirmModal>
    </div>
  );
}
