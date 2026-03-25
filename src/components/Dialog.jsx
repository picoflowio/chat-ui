/* eslint-disable react/prop-types */
import "./Dialog.css";

export default function Dialog({
  open,
  title,
  message,
  onClose,
  children,
  actions,
  className = "",
}) {
  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation">
      <div
        className={`dialog ${className}`.trim()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
      >
        <div className="dialog-header">
          <div className="dialog-title" id="dialog-title">
            {title || "Notice"}
          </div>
          <button className="dialog-close" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        <div className="dialog-body" id="dialog-message">
          {message}
          {children}
        </div>
        <div className="dialog-footer">
          {actions || (
            <button className="dialog-action" onClick={onClose}>
              Okay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
