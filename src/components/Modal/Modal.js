import React from 'react';
import './Modal.css';

export default ({ children, onClose, raw }) => {
  if (raw) {
    return (
      <div className="Modal-wrapper">
        <div className="Modal-content-raw">{children}</div>
      </div>
    );
  }

  return (
    <div className="Modal-wrapper">
      <div className="Modal-content">
        <button className="Modal-close" onClick={onClose} title="Close Modal">
          X
        </button>
        {children}
      </div>
    </div>
  );
};
