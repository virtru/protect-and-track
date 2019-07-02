import React from 'react';
import './Policy.css';

function PolicyPanel({ file }) {
  return (
    <div className="PolicyPanel">
      <h2 className="PolicyPanel-filename">{file.file.name}</h2>
    </div>
  );
}

export default PolicyPanel;
