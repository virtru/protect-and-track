import React, { useState, useEffect } from 'react';
import { connect } from 'redux-zero/react/index';

import Sidebar from '../Sidebar/Sidebar';

import * as tdf from 'utils/tdfWrapper';
import Drop from './components/Drop/Drop';
import Filename from './components/Filename/Filename';
import Policy, { ENCRYPT_STATES } from './scenes/Policy/Policy';

import './Document.css';
import downloadHtml from '../../utils/downloadHtml';
import Button from '../../components/Button/Button';

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
  const [encryptState, setEncryptState] = useState(ENCRYPT_STATES.UNPROTECTED);

  useEffect(() => {
    (async () => {
      if (!userId || virtruClient) {
        return;
      }
      const client = await tdf.authenticate(userId);
      updateVirtruClient(client);
      setEncryptState(ENCRYPT_STATES.UNPROTECTED);
    })();
  }, [userId, updateVirtruClient, virtruClient]);

  const login = async () => {
    setEncryptState(ENCRYPT_STATES.AUTHENTICATING);
    const email = prompt('Enter email');
    const client = await tdf.authenticate(email);
    updateUserId(email);
    updateVirtruClient(client);
    setEncryptState(ENCRYPT_STATES.UNPROTECTED);
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
        <section className="DocumentFooter">
          {encrypted && (
            <Button variant="link" onClick={() => downloadHtml(file.file.name, encrypted)}>
              Download
            </Button>
          )}
        </section>
      </div>
      <Sidebar />
    </>
  );
}

function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

const mapToProps = ({ file, userId, virtruClient, encrypted }) => ({
  file,
  userId,
  virtruClient,
  encrypted,
});
const actions = {
  updateFile: (state, value) => {
    console.log(value);
    const b64 = arrayBufferToBase64(value.arrayBuffer);
    const fileName = value.file.name;
    const fileType = value.file.type;

    localStorage.setItem('virtru-demo-file', JSON.stringify({ b64, fileName, fileType }));
    return { file: value };
  },
  updateUserId: (state, value) => ({ userId: value }),
  updateVirtruClient: (state, value) => ({ virtruClient: value }),
  updateEncrypted: (state, value) => ({ encrypted: value }),
};

export default connect(
  mapToProps,
  actions,
)(Document);
