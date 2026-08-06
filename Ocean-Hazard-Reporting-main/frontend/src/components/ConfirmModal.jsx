import React from 'react';
import { AlertCircle } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, confirmText = 'Confirm', confirmVariant = 'primary', onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const getBtnClass = () => {
    if (confirmVariant === 'danger') return 'btn btn-danger';
    if (confirmVariant === 'success') return 'btn btn-primary';
    return 'btn btn-primary';
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '450px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--border-radius-md)',
          boxShadow: 'var(--shadow-lg)',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <AlertCircle color="var(--color-primary)" size={24} />
          <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '1.2rem' }}>{title}</h3>
        </div>

        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className={getBtnClass()}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
