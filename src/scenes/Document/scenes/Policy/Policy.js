import React from 'react';

import Access from './components/Access/Access';
import Expiration from './components/Expiration/Expiration';
import Watermarking from './components/Watermarking/Watermarking';
import Forwarding from './components/Forwarding/Forwarding';
import './Policy.css';

function PolicyPanel({ file, userId, login, encrypt, encryptState }) {
  const renderButtons = () => {
    if (userId && encryptState === 0) {
      return <button onClick={encrypt}>Protect File</button>;
    }

    if (encryptState === 1) {
      return <button disabled>Encrypting...</button>;
    }

    if (encryptState === 2) {
      return <button disabled>File Protected!</button>;
    }

    return (
      <span>
        <button onClick={login}>Sign in to continue</button>
        <button disabled>Protect File</button>
      </span>
    );
  };
  return (
    <div className="PolicyPanel" id="policypanel">
      <Access />
      <hr className="PolicyPanel-rule" />
      <Expiration />
      <hr className="PolicyPanel-rule" />
      <Forwarding />
      <Watermarking />
      <span>{renderButtons()}</span>
    </div>
  );
}

export default PolicyPanel;
