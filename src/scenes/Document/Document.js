import React, { useState, useEffect } from 'react';
import { connect } from 'redux-zero/react/index';

import Sidebar from '../Sidebar/Sidebar';

import * as tdf from 'utils/tdfWrapper';
import Drop from './components/Drop/Drop';
import Filename from './components/Filename/Filename';
import Policy, { ENCRYPT_STATES } from './scenes/Policy/Policy';
import Share from '../Share/Share';

import './Document.css';
import downloadHtml from '../../utils/downloadHtml';
import Button from '../../components/Button/Button';
import { arrayBufferToBase64 } from '../../utils/base64';

function Document({
  file,
  policy,
  updateFile,
  updatePolicy,
  userId,
  updateUserId,
  virtruClient,
  updateVirtruClient,
  encrypted,
  updateEncrypted,
}) {
  console.log(`<Document file=${JSON.stringify(file)} policy=${JSON.stringify(policy)}`);
  const [encryptState, setEncryptState] = useState(ENCRYPT_STATES.UNPROTECTED);
  const [isShareOpen, setShareOpen] = useState(false);

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
      policy: policy,
      userEmail: userId,
      asHtml: true,
    });
    updateEncrypted({
      payload: encryptedFile,
      name: `${file.file.name}.html`,
      type: file.file.type,
    });
    setEncryptState(ENCRYPT_STATES.PROTECTED);
  };

  const renderDrop = () => {
    if (!file) {
      return <Drop userId={userId} updateFile={updateFile} />;
    }

    return (
      <>
        <Drop
          policyState={encryptState === ENCRYPT_STATES.PROTECTED ? 'encrypted' : 'plain'}
          userId={userId}
          updateFile={updateFile}
        >
          <div className="DocumentDetails">
            <Filename file={file} isTdf={encryptState === ENCRYPT_STATES.PROTECTED} />
            <Policy
              file={file}
              policy={policy}
              userId={userId}
              login={login}
              encrypt={encrypt}
              encryptState={encryptState}
              updatePolicy={updatePolicy}
            />
          </div>
        </Drop>
        {isShareOpen && <Share onClose={() => setShareOpen(false)} />}
      </>
    );
  };

  const renderButtons = () => {
    return (
      <>
        <Button variant="link" onClick={() => downloadHtml(encrypted)} disabled={!encrypted}>
          Download
        </Button>
        <Button onClick={() => setShareOpen(true)} disabled={!encrypted}>
          Share
        </Button>
      </>
    );
  };

  return (
    <>
      <div className="DocumentWrapper">
        {renderDrop()}
        <section className="DocumentFooter">{renderButtons()}</section>
      </div>
      <Sidebar />
    </>
  );
}

const mapToProps = ({ encrypted, file, policy, userId, virtruClient }) => ({
  encrypted,
  file,
  policy,
  userId,
  virtruClient,
});
const actions = {
  updateFile: (state, value) => {
    console.log(value);
    const b64 = arrayBufferToBase64(value.arrayBuffer);
    const { name: fileName, type: fileType } = value.file;
    const policy = value.policy;

    // TODO migrate localStorage update to a subscription to track both policy and file changes centrally
    localStorage.setItem('virtru-demo-file', JSON.stringify({ b64, fileName, fileType, policy }));
    return { file: value, policy };
  },
  updatePolicy: (state, value) => ({ policy: value }),
  updateUserId: (state, value) => ({ userId: value }),
  updateVirtruClient: (state, value) => ({ virtruClient: value }),
  updateEncrypted: (state, value) => ({ encrypted: value }),
};

export default connect(
  mapToProps,
  actions,
)(Document);
