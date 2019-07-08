import React, { useRef, useEffect } from 'react';
import Clipboard from 'clipboard';

import './SidebarItem.css';

export default ({ title, code, timestamp }) => {
  return (
    <div className="SidebarItemWrapper">
      <div className="json-wrapper">
        <div className="title">{title}</div>
        <div className="codeWrapper">
          <pre className="prettyprint">{code}</pre>
        </div>
        <div className="timestamp">20:14:13</div>
      </div>
    </div>
  );
};
