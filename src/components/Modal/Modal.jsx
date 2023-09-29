import React from 'react';
import './Modal.css';

export const Modal = ({ children, onClose }) => {
  return (
    <div className="Modal-wrapper">
      <div className="Modal-content">
        <button className="Modal-close" onClick={onClose} title="Close Modal">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};
