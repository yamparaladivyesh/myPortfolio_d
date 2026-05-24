import React, { useEffect, useState } from 'react';

const ModalWrapper = ({ open, onClose, title, children, className = '' }) => {
  const [isMounted, setIsMounted] = useState(open);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      setIsClosing(false);
    } else if (isMounted) {
      setIsClosing(true);
      const timer = window.setTimeout(() => {
        setIsMounted(false);
        setIsClosing(false);
      }, 250);
      return () => window.clearTimeout(timer);
    }
  }, [open, isMounted]);

  if (!isMounted) return null;

  const overlayClasses = `modal-overlay ${open && !isClosing ? 'modal-open' : 'modal-closing'}`;
  const panelClasses = `modal-panel ${className} ${open && !isClosing ? 'modal-open' : 'modal-closing'}`;

  return (
    <div className={overlayClasses} onClick={onClose}>
      <div className={panelClasses} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose} aria-label="Close panel">
            ×
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default ModalWrapper;
