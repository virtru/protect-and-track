import React, { useRef, useEffect } from 'react';
import Clipboard from 'clipboard'

import './SidebarItem.css';

export default ({title, code}) => {
  const copyButton = useRef();

  useEffect(() => {
    const copy = new Clipboard(copyButton.current);
    return () => copy.destroy();
  }, []);

  return (
    <div className="SidebarItemWrapper">
      <div className="json-wrapper">
        <div className="showPayload">{title}</div>
        <div className="codeWrapper">
          <pre className="prettyprint">
            {code}
          </pre>
        </div>
        <div
          className="button"
          ref={copyButton}
          data-clipboard-text={code}
        >
          copy
        </div>
      </div>
    </div>
  );
}
