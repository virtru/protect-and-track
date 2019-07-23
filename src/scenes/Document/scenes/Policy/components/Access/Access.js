import React, { useState } from 'react';

import SectionHeader from '../SectionHeader/SectionHeader';
import { ReactComponent as AccessIcon } from './access.svg';
import ENCRYPT_STATES from 'constants/encryptStates';
import Virtru from '../../../../../../utils/VirtruWrapper';
import './Access.css';

function Access({ encryptState, userId, policy, setPolicy }) {
  const policyChange = change => e => {
    e && e.preventDefault();
    const policyBuilder = Virtru.policyBuilder(policy);
    if (change(policyBuilder) === 'NOPE') {
      return false;
    }
    setPolicy(policyBuilder.build());
    return false;
  };

  const Grant = ({ user, status }) => {
    if (status === 'owner') {
      return (
        <div className="Grant">
          <span className="Grant-user">{user}</span>
          <div className="Grant-owner">Owner</div>
        </div>
      );
    }

    return (
      <form className="Grant" onSubmit={policyChange(p => p.removeUsers(user))}>
        <span className="Grant-user">{user}</span>
        <input type="submit" className="Grant-revoke" value="Revoke" />
      </form>
    );
  };

  const NewGrant = () => {
    const [input, setInput] = useState({ text: '', valid: false });

    return (
      <form
        className="NewGrant"
        onSubmit={policyChange(p => (input.valid ? p.addUsers(input.text) : 'NOPE'))}
      >
        <input
          type="email"
          name="newUser"
          onChange={e => setInput({ text: e.target.value, valid: e.target.validity.valid })}
          value={input.text}
        />
        <input type="submit" className="Grant-grant" disabled={!input.valid} value="Grant" />
      </form>
    );
  };

  return (
    <div className="Access">
      <SectionHeader>
        <AccessIcon />
        <h4>Who should have access?</h4>
        {encryptState === ENCRYPT_STATES.PROTECTED && (
          <button className="Access-revokeAll" onClick={policyChange(p => p.removeAllUsers())}>
            Revoke All
          </button>
        )}
      </SectionHeader>
      <ol start="0">
        <li key={'you'}>
          <Grant user={userId || 'you'} status="owner" />
        </li>
        {policy
          .getUsers()
          .filter(u => u !== userId)
          .map((user, i) => {
            return (
              <li key={user}>
                <Grant user={user} status="reader" />
              </li>
            );
          })}
      </ol>
      <NewGrant />
    </div>
  );
}

export default Access;
