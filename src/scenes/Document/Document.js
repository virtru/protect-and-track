import React from 'react';
import Drop from './components/Drop/Drop';
import SidebarLogger from '../../scenes/SidebarLogger/SidebarLogger';
import Policy from './scenes/Policy/Policy';
import Share from 'scenes/Share/Share';

import './Document.css';
import { connect } from 'redux-zero/react/index';

const Document = ({ file, userId, updateFile }) => (
  <>
    <SidebarLogger />
    <div className="document-wrapper">
      <Drop userId={userId} updateFile={updateFile}>
        {file && <Policy file={file} />}
      </Drop>
      {file && <Share />}
    </div>
  </>
);

const mapToProps = ({ file, appIdBundle }) => ({
  file,
  userId: new URLSearchParams(window.location.search).get('id') || appIdBundle[0].userId,
});
const actions = {
  updateFile: (state, value) => ({ file: value }),
};

export default connect(
  mapToProps,
  actions,
)(Document);
