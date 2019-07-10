import React, { useState } from 'react';
import { connect } from 'redux-zero/react/index';

import Share from 'scenes/Share/Share';
import Sidebar from '../Sidebar/Sidebar';

import * as tdf from 'utils/tdfWrapper';
import Drop from './components/Drop/Drop';
import Filename from './components/Filename/Filename';
import Policy from './scenes/Policy/Policy';

import './Document.css';
import { get } from 'lodash';

function Document({
  file,
  updateFile,
  userId,
  updateUserId,
  virtruClient,
  updateVirtruClient,
  encrypted,
  updateEncrypted,
}) {
  const [encryptState, setEncryptState] = useState(0);

  const login = async () => {
    const email = prompt('Enter email');
    const client = await tdf.authenticate(email);
    updateUserId(email);
    updateVirtruClient(client);
  };

  const encrypt = async () => {
    setEncryptState(1);
    const encryptedFile = await tdf.encrypt({
      client: virtruClient,
      fileData: file.data,
      filename: file.file.name,
      userEmail: userId,
      asHtml: true,
    });
    updateEncrypted(encryptedFile);
    setEncryptState(2);
  };

  const download = () => {
    console.log(encrypted);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(encrypted));
    element.setAttribute('download', `${file.file.name}.html`);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  const renderDrop = () => {
    if (!file) {
      return <Drop userId={userId} updateFile={updateFile} />;
    }

    return (
      <>
        <Drop userId={userId} updateFile={updateFile}>
          <div className="DocumentDetails">
            <Filename file={file} />
            <Policy
              file={file}
              userId={userId}
              login={login}
              encrypt={encrypt}
              encryptState={encryptState}
            />
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
          <h3>
            Placeholder for bottom area {encrypted && <button onClick={download}>Download</button>}
          </h3>
        </section>
      </div>
      <Sidebar />
    </>
  );
}

const mapToProps = ({ file, userId, virtruClient, encrypted }) => ({
  file,
  userId,
  virtruClient,
  encrypted,
});
const actions = {
  updateFile: (state, value) => ({ file: value }),
  updateUserId: (state, value) => ({ userId: value }),
  updateVirtruClient: (state, value) => ({ virtruClient: value }),
  updateEncrypted: (state, value) => ({ encrypted: value }),
};

export default connect(
  mapToProps,
  actions,
)(Document);
