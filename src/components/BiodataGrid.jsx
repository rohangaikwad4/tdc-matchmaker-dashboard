/**
 * Renders a responsive grid of BiodataField entries.
 * Configurable column count for different layout contexts.
 *
 * @param {Array<{ label: string, value: string }>} fields - Array of field definitions.
 * @param {number} columns - Number of grid columns (default 2).
 */
import BiodataField from './BiodataField';

export default function BiodataGrid({ fields, columns = 2 }) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-${columns} gap-x-6 gap-y-0`}
    >
      {fields.map((field) => (
        <BiodataField
          key={field.label}
          label={field.label}
          value={field.value}
        />
      ))}
    </div>
  );
}
