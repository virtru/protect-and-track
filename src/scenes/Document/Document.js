import React from 'react';
import Drop from './components/Drop/Drop';
import Sidebar from '../Sidebar/Sidebar';
import Policy from './scenes/Policy/Policy';
import Share from 'scenes/Share/Share';

import './Document.css';
import { connect } from 'redux-zero/react/index';
import { get } from 'lodash';

const Document = ({ file, userId, updateFile }) => (
  <>
    <div className="document-wrapper">
      <Drop userId={userId} updateFile={updateFile}>
        {file && <Policy file={file} />}
      </Drop>
      {file && <Share />}
    </div>
    <Sidebar />
  </>
);

const mapToProps = ({ file, appIdBundle }) => ({
  file,
  userId: new URLSearchParams(window.location.search).get('id') || get(appIdBundle[0], 'userId'),
});
const actions = {
  updateFile: (state, value) => ({ file: value }),
};

export default connect(
  mapToProps,
  actions,
)(Document);
