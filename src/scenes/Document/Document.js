import React, { useState } from 'react';
import { connect } from 'redux-zero/react/index';

import Sidebar from '../Sidebar/Sidebar';

import * as tdf from 'utils/tdfWrapper';
import Drop from './components/Drop/Drop';
import Filename from './components/Filename/Filename';
import Policy, { ENCRYPT_STATES } from './scenes/Policy/Policy';

import './Document.css';
import downloadHtml from '../../utils/downloadHtml';

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
    setEncryptState(ENCRYPT_STATES.PROTECTING);
    const encryptedFile = await tdf.encrypt({
      client: virtruClient,
      fileData: file.data,
      filename: file.file.name,
      userEmail: userId,
      asHtml: true,
    });
    updateEncrypted(encryptedFile);
    setEncryptState(ENCRYPT_STATES.PROTECTED);
  };

  const renderDrop = () => {
    if (!file) {
      return <Drop userId={userId} updateFile={updateFile} />;
    }

    return (
      <>
        <Drop userId={userId} updateFile={updateFile}>
          <div className="DocumentDetails">
            <Filename file={file} isTdf={encryptState === ENCRYPT_STATES.PROTECTED} />
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
            Placeholder for bottom area{' '}
            {encrypted && (
              <button onClick={() => downloadHtml(file.file.name, encrypted)}>Download</button>
            )}
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
