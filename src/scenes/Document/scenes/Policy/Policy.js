import React from 'react';

import Access from './components/Access/Access';
import Expiration from './components/Expiration/Expiration';
import Watermarking from './components/Watermarking/Watermarking';
import Resharing from './components/Resharing/Resharing';
import Button from 'components/Button/Button';
import ENCRYPT_STATES from 'constants/encryptStates';
import './Policy.css';

function Policy({
  userId,
  openAuthModal,
  encrypt,
  encryptState,
  policy,
  policyChange,
  virtruClient,
  policyId,
}) {
  const renderButtons = () => {
    switch (encryptState) {
      case ENCRYPT_STATES.AUTHENTICATING:
        return <Button disabled>Authenticating...</Button>;
      case ENCRYPT_STATES.PROTECTING:
        return <Button disabled>Protecting...</Button>;
      case ENCRYPT_STATES.PROTECTED:
        return null;
      case ENCRYPT_STATES.PROTECTED_NO_AUTH:
        return <Button onClick={openAuthModal}>Sign in to Protect</Button>;
      default:
        if (userId) {
          return (
            <Button data-testid="encryptFile" onClick={encrypt}>
              Protect File
            </Button>
          );
        }

        return (
          <>
            <Button onClick={openAuthModal}>Sign in to Protect</Button>
            <Button disabled>Protect File</Button>
          </>
        );
    }
  };
  if (encryptState !== ENCRYPT_STATES.PROTECTED) {
    return (
      <div className="Policy" id="policy">
        <Access
          virtruClient={virtruClient}
          policy={policy}
          policyId={policyId}
          policyChange={policyChange}
          userId={userId}
        />
        <span className="Policy-buttons">{renderButtons()}</span>
      </div>
    );
  }
  return (
    <div className="Policy" id="policy">
      <Access
        virtruClient={virtruClient}
        policyId={policyId}
        policy={policy}
        encryptState={encryptState}
        policyChange={policyChange}
        userId={userId}
      />
      <hr className="Policy-rule" />
      <Expiration policy={policy} policyChange={policyChange} />
      <Resharing policy={policy} policyChange={policyChange} />
      <Watermarking policy={policy} policyChange={policyChange} />
    </div>
  );
}

export default Policy;
