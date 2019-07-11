import React from 'react';

import Access from './components/Access/Access';
import Expiration from './components/Expiration/Expiration';
import Watermarking from './components/Watermarking/Watermarking';
import Forwarding from './components/Forwarding/Forwarding';
import './Policy.css';

export const ENCRYPT_STATES = {
  UNPROTECTED: 0,
  PROTECTING: 1,
  PROTECTED: 2,
};

function PolicyPanel({ file, userId, login, encrypt, encryptState }) {
  const renderButtons = () => {
    switch (encryptState) {
      case ENCRYPT_STATES.PROTECTING:
        return <button disabled>Protecting...</button>;
      case ENCRYPT_STATES.PROTECTED:
        return null;
      default:
        if (userId) {
          return <button onClick={encrypt}>Protect File</button>;
        }

        return (
          <>
            <button onClick={login}>Sign in to continue</button>
            <button disabled>Protect File</button>
          </>
        );
    }
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
