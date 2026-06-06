/**
 * Toast notification component with auto-dismiss.
 * Slides in from the top-right with the TDC gradient for brand consistency.
 *
 * @param {string|null} message - Notification text (null hides the toast).
 * @param {'success'} type - Toast style variant.
 * @param {Function} onClose - Callback when the toast is dismissed.
 */
import { useEffect, useState } from 'react';

const toastStyles = {
  success: 'tdc-gradient',
};

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [message]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 ${
        toastStyles[type] || toastStyles.success
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-tdc-gold-300">✓</span>
        <span>{message}</span>
        {onClose && (
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/80 hover:text-white ml-2 transition-colors"
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
