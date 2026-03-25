/* eslint-disable react/prop-types */
import "./Dialog.css";

export default function Dialog({ open, title, message, onClose }) {
  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation">
      <div
        className="dialog"
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
        </div>
        <div className="dialog-footer">
          <button className="dialog-action" onClick={onClose}>
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}
