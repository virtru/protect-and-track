import React, { useState } from 'react';

import Button from '../../../../components/Button/Button';
import Modal from '../../../../components/Modal/Modal';

import './RevokeAll.css';

function RevokeAll({ isPolicyRevoked, revokePolicy }) {
  const [isShowWarning, setShowWarning] = useState(false);

  const doClose = () => {
    setShowWarning(false);
  };

  const doRevoke = () => {
    revokePolicy();
    doClose();
  };

  return (
    <>
      <Button
        className="RevokeAll"
        disabled={isPolicyRevoked}
        onClick={() => {
          setShowWarning(true);
        }}
      >
        {isPolicyRevoked ? 'Revoked' : 'Revoke Policy'}
      </Button>
      {isShowWarning && (
        <Modal onClose={doClose}>
          <div className="RevokeAll-container">
            <div className="RevokeAll-title">Revoke Policy</div>
            <div className="RevokeAll-text">
              <p>If you revoke this file, only you will be able to access it.</p>
              <p>The SDK does not currently support undoing this action.</p>
            </div>
            <Button className="RevokeAll-confirm" onClick={doRevoke}>
              Yes, Revoke This File
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default RevokeAll;
