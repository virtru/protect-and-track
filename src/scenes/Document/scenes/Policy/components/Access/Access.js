import React, { useState } from 'react';

import SectionHeader from '../SectionHeader/SectionHeader';
import { ReactComponent as AccessIcon } from './access.svg';
import { NOPE } from '../../services/policyChanger';
import './Access.css';
import Button from 'components/Button/Button';

function Access({ encryptState, userId, policy, policyChange, isPolicyRevoked }) {
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
      <form className="Grant" onSubmit={policyChange(p => p.removeUsersWithAccess(user))}>
        <span className="Grant-user">{user}</span>
        <input type="submit" className="Grant-revoke" value="Revoke" disabled={isPolicyRevoked} />
      </form>
    );
  };

  const NewGrant = () => {
    const [input, setInput] = useState({ text: '', valid: false });
    let hasUsers = policy.getUsersWithAccess().length > 0;

    let action;
    if (hasUsers) {
      action = (
        <input type="submit" className="Grant-grant" disabled={!input.valid} value="Grant" />
      );
    } else {
      action = (
        <Button type="submit" disabled={!input.valid}>
          Grant
        </Button>
      );
    }

    return (
      <form
        className="NewGrant"
        onSubmit={policyChange(p => (input.valid ? p.addUsersWithAccess(input.text) : NOPE))}
      >
        <input
          type="email"
          name="newUser"
          onChange={e => setInput({ text: e.target.value, valid: e.target.validity.valid })}
          value={input.text}
        />
        {action}
      </form>
    );
  };

  return (
    <div className="Access">
      <SectionHeader>
        <AccessIcon />
        <h4>Who should have access?</h4>
      </SectionHeader>
      <ol start="0">
        <li key={'you'}>
          <Grant user={userId || 'you'} status="owner" />
        </li>
        {!isPolicyRevoked &&
          policy
            .getUsersWithAccess()
            .filter(u => u !== userId)
            .map((user, i) => {
              return (
                <li key={user}>
                  <Grant user={user} status="reader" />
                </li>
              );
            })}
      </ol>
      {!isPolicyRevoked && <NewGrant />}
    </div>
  );
}

export default Access;
