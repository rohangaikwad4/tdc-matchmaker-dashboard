/**
 * Displays a single biodata field with label and value.
 * Clean two-line layout for dense profile information.
 *
 * @param {string} label - The field name (e.g. "Age", "Religion").
 * @param {string|number} value - The field value.
 */
export default function BiodataField({ label, value }) {
  return (
    <div className="border-b border-gray-50 pb-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <p className="text-sm text-gray-800 mt-0.5">{value}</p>
    </div>
  );
}
