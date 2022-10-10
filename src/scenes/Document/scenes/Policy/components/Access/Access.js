import React, { useState } from 'react';

import { SectionHeader } from '../SectionHeader/SectionHeader.js';
import { ReactComponent as AccessIcon } from './access.svg';
import { NOPE } from '../../services/policyChanger.js';
import './Access.css';
import { Button } from '../../../../../../components/Button/Button.js';
import { ReactComponent as InfoIcon } from './info-icon.svg';

function Access({ encryptState, userId, policy, policyChange, isPolicyRevoked }) {
  /**** Virtru Block ****
   *
   * The following code shows how to get users who have access to a policy
   * and how to add users to a policy.
   * https://developer.virtru.com/docs/how-to-add-virtru-controls
   *
   *****/

  // Get policy users with access
  const policyUsersWithAccess = policy.getUsersWithAccess();

  // Add users with access to the policy by email address
  const addUsersToPolicy = ({ valid, text: email }) =>
    policyChange((policy) => {
      if (valid) {
        // Virtru: Add users with access to the policy by email address
        return policy.addUsersWithAccess(email);
      }
      return NOPE;
    });

  /**** END Virtru Block ****/

  const Grant = ({ user, status }) => {
    if (status === 'owner') {
      return (
        <div className="Grant">
          <div className="Grant-user">{user}</div>
          <div className="Grant-owner">Owner</div>
        </div>
      );
    }

    return (
      <form className="Grant" onSubmit={policyChange((p) => p.removeUsersWithAccess(user))}>
        <div className="Grant-user">{user}</div>
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
        <Button disabled={!input.valid} type="submit" small>
          Grant
        </Button>
      );
    }

    return (
      <form className="NewGrant" onSubmit={addUsersToPolicy(input)}>
        <div className="field-with-description">
          <input
            type="email"
            name="newUser"
            pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,24}$"
            onChange={(e) =>
              setInput({
                text: e.target.value,
                valid: e.target && !!e.target.value && e.target.validity.valid,
              })
            }
            value={input.text}
          />
          <div className="field-description">
            <InfoIcon className="icon info-icon" /> Enter an email address
          </div>
          <div className="field-error">
            <InfoIcon className="icon info-icon" /> Invalid email address
          </div>
        </div>
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
          policyUsersWithAccess
            .filter((u) => u !== userId)
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
