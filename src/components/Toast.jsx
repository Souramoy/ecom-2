import { Check, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-item" role="status">
          {toast.type === 'success' ? (
            <Check size={16} color="#C7FF4D" aria-hidden="true" />
          ) : (
            <Info size={16} color="#C7FF4D" aria-hidden="true" />
          )}
          <span style={{ flex: 1 }}>{toast.message}</span>
          {toast.action && (
            <button
              type="button"
              className="toast-action-btn"
              onClick={() => {
                toast.action.onClick();
                removeToast(toast.id);
              }}
            >
              {toast.action.label}
            </button>
          )}
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
            style={{ color: '#B3B3B3', display: 'inline-flex' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
