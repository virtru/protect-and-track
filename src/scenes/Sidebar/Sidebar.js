import React from 'react';
import { connect } from 'redux-zero/react';
import './Sidebar.css';
import AuditLogger from './components/AuditLogger/AuditLogger.js';

import SdkLogger from './components/SdkLogger/SdkLogger.js';

const Sidebar = ({ tdfLog = [] }) => {
  return (
    <div className="sidebarWrapper">
      <div className="auditEvents">
        <h3>Tracked events</h3>
        <AuditLogger />
      </div>
      <div className="sdkEvents">
        <h3>SDK calls</h3>
        {tdfLog.length ? <SdkLogger events={tdfLog} /> : <p>Protect a file to see SDK calls</p>}
      </div>
    </div>
  );
};

const mapToProps = ({ tdfLog }) => ({ tdfLog });
export default connect(mapToProps)(Sidebar);
