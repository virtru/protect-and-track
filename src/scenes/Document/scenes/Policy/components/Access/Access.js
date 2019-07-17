import React from 'react';

import SectionHeader from '../SectionHeader/SectionHeader';
import { ReactComponent as AccessIcon } from './access.svg';
import { ENCRYPT_STATES } from '../../Policy';
import './Access.css';

function Grant({ user, status }) {
  let action =
    status === 'owner' ? (
      <div className="Grant-owner">Owner</div>
    ) : (
      <button className="Grant-reader">Revoke</button>
    );

  return (
    <li>
      <div className="Grant">
        <span className="Grant-user">{user}</span>
        {action}
      </div>
    </li>
  );
}

function NewGrant() {
  return (
    <div className="NewGrant">
      <input type="email" />
      <button>Grant</button>
    </div>
  );
}

function Access({ encryptState, policy }) {
  return (
    <div className="Access">
      <SectionHeader>
        <AccessIcon />
        <h4>Who should have access?</h4>
        {encryptState === ENCRYPT_STATES.PROTECTED && (
          <button className="Access-revokeAll">Revoke All</button>
        )}
      </SectionHeader>
      <ol start="0">
        {policy.getUsers().map((user, i) => {
          return <Grant user={user} status={i ? 'reader' : 'owner'} />;
        })}
      </ol>
      <NewGrant />
    </div>
  );
}

export default Access;
