import React from 'react';

import './SidebarItem.css';

export default () => (
  <div>
    <div className="json-wrapper">
      <div className="showPayload">Show payload</div>
      <pre className="json">{JSON.stringify({
        main: 'line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;',
        key: 'color:#f92672;',
        string: 'color:#fd971f;',
        value: 'color:#a6e22e;',
        boolean: 'color:#ac81fe;',
      }, null, 2) }</pre>
    </div>
  </div>
)
