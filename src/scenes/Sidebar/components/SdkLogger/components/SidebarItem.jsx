import React from 'react';

import './SidebarItem.css';

export const SidebarItem = ({ title, code, timestamp }) => {
  return (
    <div className="SidebarItemWrapper">
      <div className="json-wrapper">
        <div className="title">{title}</div>
        <div className="codeWrapper">
          <pre className="prettyprint">{code}</pre>
        </div>
        <div className="timestamp">{timestamp.format('h:mm:ss')}</div>
      </div>
    </div>
  );
};
