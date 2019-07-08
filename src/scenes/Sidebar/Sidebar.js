import React from 'react';
import { connect } from 'redux-zero/react';
import './Sidebar.css';

import SdkLogger from './components/SdkLogger/SdkLogger';
import useIsPortrait from '../../commonHooks/useIsPortrait';

const Sidebar = ({ tdfLog }) => {
  // const isPortrait = useIsPortrait();

  // const contentToRender = <Sidebar events={tdfLog} />
  // return !isPortrait && contentToRender;
  return (
    <div className="sidebarWrapper">
      <h3>Tracked events</h3>
      <p>Protect a file to enable tracking</p>
      <h3>SDK calls</h3>
      {tdfLog.length ? <SdkLogger events={tdfLog} /> : <p>Protect a file to see SDK calls</p>}
    </div>
  );
};

const mapToProps = ({ tdfLog }) => ({ tdfLog });
export default connect(mapToProps)(Sidebar);
