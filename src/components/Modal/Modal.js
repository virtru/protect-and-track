import React from 'react';
import './Modal.css';

export default ({ children, onClose }) => (
  <div className="Modal-wrapper">
    <div className="Modal-content">
      <button className="Modal-close" onClick={onClose} title="Close Modal">
        X
      </button>
      {children}
    </div>
  </div>
);
