import React from 'react';
import './Policy.css';
import Store from '../../store';

function PolicyPanel() {
  const store = Store.useStore();
  return (
    <div className="PolicyPanel">
      <h2 className="PolicyPanel-filename">{store.get('file').file.name}</h2>
    </div>
  );
}

export default PolicyPanel;
