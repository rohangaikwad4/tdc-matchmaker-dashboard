/**
 * Reusable confirmation modal with overlay, title, content slot, and action buttons.
 * Animates in with a fade + scale transition for a premium feel.
 *
 * @param {boolean} open - Whether the modal is visible.
 * @param {Function} onClose - Called when dismissing the modal.
 * @param {Function} onConfirm - Called when confirming the action.
 * @param {string} title - Modal header title.
 * @param {ReactNode} children - Modal body content.
 * @param {string} confirmText - Label for the confirm button.
 * @param {string} cancelText - Label for the cancel button.
 */
export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-fadeInUp">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          {children}
          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 tdc-btn justify-center text-sm"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
