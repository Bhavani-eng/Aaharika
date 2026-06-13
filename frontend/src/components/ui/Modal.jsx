import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Button } from './Button';

export const Modal = ({ isOpen, onClose, title, description, children, size = 'md', footer }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-surface rounded-2xl shadow-lg animate-slide-up max-h-[90vh] flex flex-col`}>
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 p-6 border-b border-border-light shrink-0">
            <div>
              {title && <h2 className="text-h3">{title}</h2>}
              {description && <p className="text-sm text-text-light mt-1">{description}</p>}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-light hover:text-text hover:bg-gray-100 transition-colors shrink-0"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="p-6 border-t border-border-light shrink-0 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', loading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="text-sm text-text-light leading-relaxed">{message}</p>
    <div className="flex gap-3 mt-6 justify-end">
      <Button variant="ghost" onClick={onClose}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
    </div>
  </Modal>
);
