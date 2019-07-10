import React from 'react';
import { connect } from 'redux-zero/react/index';

import Share from 'scenes/Share/Share';
import Sidebar from '../Sidebar/Sidebar';

import Drop from './components/Drop/Drop';
import Filename from './components/Filename/Filename';
import Policy from './scenes/Policy/Policy';

import './Document.css';
import { get } from 'lodash';

function Document({ file, userId, updateFile }) {
  const renderDrop = () => {
    if (!file) {
      return <Drop userId={userId} updateFile={updateFile} />;
    }

    return (
      <>
        <Drop userId={userId} updateFile={updateFile}>
          <div class="DocumentDetails">
            <Filename file={file} />
            <Policy file={file} />
          </div>
        </Drop>
        {/* {file && <Share />} -- add this back in on a button click */}
      </>
    );
  };

  return (
    <>
      <div className="DocumentWrapper">
        {renderDrop()}
        <section>
          <h3>Placeholder for bottom area</h3>
        </section>
      </div>
      <Sidebar />
    </>
  );
}

const mapToProps = ({ file, appIdBundle }) => ({
  file,
  userId: new URLSearchParams(window.location.search).get('id') || get(appIdBundle, '[0].userId'),
});
const actions = {
  updateFile: (state, value) => ({ file: value }),
};

export default connect(
  mapToProps,
  actions,
)(Document);
