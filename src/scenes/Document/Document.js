import React from 'react';
import Drop from './components/Drop/Drop';
import Policy from './scenes/Policy/Policy';
import Share from 'scenes/Share/Share';

import './Document.css';
import actions from './actions';
import { connect } from "redux-zero/react/index";


function Document({ file, userId, updateFile }) {
  console.log(`<Document file="${file}" userId="${userId}">`);
  if (!file) {
    return (
      <div className="document-wrapper">
        <Drop userId={userId} updateFile={updateFile} />
      </div>
    );
  }
  return (
    <div className="document-wrapper">
      <Drop userId={userId} updateFile={updateFile} >
        <Policy file={file} />
      </Drop>
      {/* TODO(DSAT-17): make this modal */}
      <Share />
    </div>
  );
}

const mapToProps = ({ file, appIdBundle }) => ({
  file,
  userId: (new URLSearchParams(window.location.search)).get('id') || appIdBundle[0].userId,
});

export default connect(
  mapToProps,
  actions,
)(Document);
