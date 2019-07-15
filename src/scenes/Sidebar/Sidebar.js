import React from 'react';
import { connect } from 'redux-zero/react';
import './Sidebar.css';

import SdkLogger from './components/SdkLogger/SdkLogger';

const Sidebar = ({ tdfLog, auditEvents }) => {
  return (
    <div className="sidebarWrapper">
      <h3>Tracked events</h3>
      {!!auditEvents.length && auditEvents.map(event => <div>{event.auditDataType}</div>)}
      {!auditEvents.length && <p>Protect a file to enable tracking</p>}
      <h3>SDK calls</h3>
      {tdfLog.length ? <SdkLogger events={tdfLog} /> : <p>Protect a file to see SDK calls</p>}
    </div>
  );
};

const mapToProps = ({ tdfLog, auditEvents }) => ({ tdfLog, auditEvents });
export default connect(mapToProps)(Sidebar);
