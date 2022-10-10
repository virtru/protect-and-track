import React, { useState } from 'react';

import { Button } from '../../../../components/Button/Button.js';
import { Modal } from '../../../../components/Modal/Modal.js';

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
        small
        variant="link"
        disabled={isPolicyRevoked}
        onClick={() => {
          setShowWarning(true);
        }}
      >
        {isPolicyRevoked ? 'Revoked' : 'Revoke Policy'}
      </Button>
      {isShowWarning && (
        <Modal onClose={doClose}>
          <h1>Revoke Policy</h1>
          <p>If you revoke this file, only you will be able to access it.</p>
          <p>
            <strong>The SDK does not currently support undoing this action.</strong>
          </p>
          <Button className="button destructiveButton" onClick={doRevoke}>
            Yes, Revoke This File
          </Button>
        </Modal>
      )}
    </>
  );
}

export default RevokeAll;
