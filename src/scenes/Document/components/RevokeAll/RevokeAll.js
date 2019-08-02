import React, { useState } from 'react';

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
      <button
        className="RevokeAll"
        disabled={isPolicyRevoked}
        onClick={() => {
          setShowWarning(true);
        }}
      >
        {isPolicyRevoked ? 'Revoked' : 'Revoke File'}
      </button>
      {isShowWarning && (
        <Modal onClose={doClose}>
          <div className="RevokeAll-container">
            <div className="RevokeAll-title">Revoke File</div>
            <div className="RevokeAll-text">
              If you revoke this file, only you will be able to access it.
              <p />
              The SDK does not currently support undoing this action.
            </div>
            <button className="RevokeAll-confirm" onClick={doRevoke}>
              Yes, Revoke This File
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default RevokeAll;
