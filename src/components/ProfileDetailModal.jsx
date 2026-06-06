/**
 * Full-screen modal showing detailed biodata for a match profile.
 * Includes compact biodata grid and about section.
 *
 * @param {Object|null} profile - The profile to display, or null to hide.
 * @param {Function} onClose - Callback to dismiss the modal.
 */
import Avatar from './Avatar';
import BiodataGrid from './BiodataGrid';

export default function ProfileDetailModal({ profile, onClose }) {
  if (!profile) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeInUp">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar
                firstName={profile.firstName}
                lastName={profile.lastName}
                size="md"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {profile.age} yrs · {profile.city}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl transition-colors"
              aria-label="Close profile"
            >
              ✕
            </button>
          </div>

          <BiodataGrid
            columns={2}
            fields={[
              {
                label: 'Gender',
                value:
                  profile.gender === 'male' ? 'Male' : 'Female',
              },
              { label: 'Date of Birth', value: profile.dateOfBirth },
              { label: 'Height', value: `${profile.height} cm` },
              { label: 'Religion', value: profile.religion },
              { label: 'Caste', value: profile.caste },
              {
                label: 'Education',
                value: `${profile.degree}, ${profile.undergraduateCollege}`,
              },
              {
                label: 'Income',
                value: `₹${(profile.income / 100000).toFixed(1)} LPA`,
              },
              { label: 'Company', value: profile.currentCompany },
              { label: 'Designation', value: profile.designation },
              {
                label: 'Marital Status',
                value: profile.maritalStatus,
              },
              {
                label: 'Languages',
                value: profile.languagesKnown.join(', '),
              },
              { label: 'Manglik', value: profile.manglik },
              { label: 'Diet', value: profile.diet },
              { label: 'Smoking', value: profile.smoking },
              { label: 'Drinking', value: profile.drinking },
              { label: 'Family Type', value: profile.familyType },
              {
                label: 'Hobbies',
                value: profile.hobbies.join(', '),
              },
              { label: 'Want Kids', value: profile.wantKids },
              {
                label: 'Open to Relocate',
                value: profile.openToRelocate,
              },
              { label: 'Open to Pets', value: profile.openToPets },
            ]}
          />

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
              About
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {profile.about}
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
