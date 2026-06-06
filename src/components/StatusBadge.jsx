const statusStyles = {
  new: 'bg-tdc-green-100 text-tdc-green-800 border-tdc-green-200',
  profile_verified: 'bg-tdc-green-50 text-tdc-green-700 border-tdc-green-200',
  matches_reviewed: 'bg-tdc-gold-100 text-tdc-gold-800 border-tdc-gold-200',
  meeting_scheduled: 'bg-tdc-gold-100 text-tdc-gold-700 border-tdc-gold-200',
  active_discussion: 'bg-tdc-green-50 text-tdc-green-800 border-tdc-green-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusIcons = {
  new: '🆕',
  profile_verified: '✅',
  matches_reviewed: '👀',
  meeting_scheduled: '📅',
  active_discussion: '💬',
  closed: '🔒',
};

const statusLabels = {
  new: 'New',
  profile_verified: 'Profile Verified',
  matches_reviewed: 'Matches Reviewed',
  meeting_scheduled: 'Meeting Scheduled',
  active_discussion: 'Active Discussion',
  closed: 'Closed',
};

export default function StatusBadge({ status, size = 'sm' }) {
  const sizeClasses =
    size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';
  return (
    <span
      className={`${sizeClasses} rounded-full font-medium border whitespace-nowrap inline-flex items-center gap-1 ${
        statusStyles[status] || statusStyles.new
      }`}
    >
      <span>{statusIcons[status]}</span>
      <span>{statusLabels[status] || status}</span>
    </span>
  );
}

export { statusLabels };
