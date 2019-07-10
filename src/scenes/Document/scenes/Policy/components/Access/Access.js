import React from 'react';

import SectionHeader from '../SectionHeader/SectionHeader';
import { ReactComponent as AccessIcon } from './access.svg';
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

function Access() {
  return (
    <div className="Access">
      <SectionHeader>
        <AccessIcon />
        <h4>Who should have access?</h4>
        <button className="Access-revokeAll">Revoke All</button>
      </SectionHeader>
      <ol start="0">
        <Grant user="kathy@domain.com" status="owner" />
        <Grant user="burt.with.the.long.name@example.com.invalid" status="reader" />
        <Grant user="sally@elsewhere.com" status="reader" />
      </ol>
      <NewGrant />
    </div>
  );
}

export default Access;
