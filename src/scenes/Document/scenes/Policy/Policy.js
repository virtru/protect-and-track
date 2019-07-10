import React from 'react';
import Access from './components/Access/Access';
import Expiration from './components/Expiration/Expiration';
import Watermarking from './components/Watermarking/Watermarking';
import Forwarding from './components/Forwarding/Forwarding';
import './Policy.css';

function PolicyPanel({ file }) {
  return (
    <div className="PolicyPanel" id="policypanel">
      <Access />
      <hr className="PolicyPanel-rule" />
      <Expiration />
      <hr className="PolicyPanel-rule" />
      <Forwarding />
      <Watermarking />
    </div>
  );
}

export default PolicyPanel;
