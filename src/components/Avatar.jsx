/**
 * Avatar component with deterministic gradient colors.
 * Generates a unique gradient per user based on name hash,
 * ensuring consistent colors across sessions.
 *
 * @param {string} firstName - User's first name.
 * @param {string} lastName - User's last name.
 * @param {'sm'|'md'|'lg'} size - Avatar size preset.
 */
const gradients = [
  'from-tdc-green-500 to-tdc-green-700',
  'from-tdc-green-600 to-tdc-green-900',
  'from-tdc-gold-400 to-tdc-gold-600',
  'from-tdc-green-400 to-tdc-green-800',
  'from-tdc-gold-500 to-tdc-gold-700',
  'from-tdc-green-600 to-tdc-green-950',
];

export default function Avatar({ firstName, lastName, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-xl',
    lg: 'w-20 h-20 text-3xl',
  };

  const hash = (firstName + lastName)
    .split('')
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const gradient = gradients[hash % gradients.length];

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold shrink-0`}
      title={`${firstName} ${lastName}`}
    >
      {firstName?.[0]}{lastName?.[0]}
    </div>
  );
}
