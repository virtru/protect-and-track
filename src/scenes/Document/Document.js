import React, { useState, useEffect } from 'react';
import { connect } from 'redux-zero/react/index';

import Sidebar from '../Sidebar/Sidebar';

import Virtru from 'utils/VirtruWrapper';
import Drop from './components/Drop/Drop';
import Filename from './components/Filename/Filename';
import Policy, { ENCRYPT_STATES } from './scenes/Policy/Policy';
import { getAuditEvents } from 'services/audit';
import Share from '../Share/Share';
import AuthSelect from '../AuthSelect/AuthSelect';

import './Document.css';
import downloadHtml from '../../utils/downloadHtml';
import Button from '../../components/Button/Button';
import { arrayBufferToBase64 } from '../../utils/base64';

function Document({
  appId,
  encrypted,
  file,
  policy,
  updateAuditEvents,
  updateEncrypted,
  updateFile,
  updatePolicy,
  updateVirtruClient,
  updateUserId,
  userId,
  virtruClient,
}) {
  const [encryptState, setEncryptState] = useState(ENCRYPT_STATES.UNPROTECTED);
  const [isShareOpen, setShareOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (!userId || virtruClient) {
        return;
      }
      const client = await Virtru.authenticate(userId);
      updateVirtruClient(client);
      setEncryptState(ENCRYPT_STATES.UNPROTECTED);
    })();
  }, [userId, updateVirtruClient, virtruClient]);

  const openAuthModal = () => {
    setEncryptState(ENCRYPT_STATES.AUTHENTICATING);
    setAuthOpen(true);
  };

  const loginAs = async email => {
    const client = await Virtru.authenticate(email);
    updateUserId(email);
    updateVirtruClient(client);
    setEncryptState(ENCRYPT_STATES.UNPROTECTED);
    setAuthOpen(false);
  };

  const encrypt = async () => {
    setEncryptState(ENCRYPT_STATES.PROTECTING);
    const { encryptedFile, policyId } = await Virtru.encrypt({
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
    setInterval(async () => {
      const auditRes = await getAuditEvents({ userId, appId, policyId });
      const auditData = await auditRes.json();
      updateAuditEvents(auditData.data);
    }, 2000);
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
              openAuthModal={openAuthModal}
              encrypt={encrypt}
              encryptState={encryptState}
              updatePolicy={updatePolicy}
            />
          </div>
        </Drop>
        {isShareOpen && <Share onClose={() => setShareOpen(false)} />}
        {isAuthOpen && (
          <AuthSelect
            onClose={() => {
              setAuthOpen(false);
              setEncryptState(ENCRYPT_STATES.UNPROTECTED);
            }}
            loginAs={loginAs}
          />
        )}
      </>
    );
  };

  const renderButtons = () => {
    return (
      <>
        <Button variant="link" onClick={() => downloadHtml(encrypted)} disabled={!encrypted}>
          Download
        </Button>
        <Button
          onClick={() => setShareOpen(true)}
          disabled={!encrypted || !policy || !policy.getUsers().length}
        >
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

const mapToProps = ({ appId, encrypted, file, policy, userId, virtruClient }) => ({
  appId,
  encrypted,
  file,
  policy,
  userId,
  virtruClient,
});
const updateLocalStorage = (file, policy) => {
  const b64 = arrayBufferToBase64(file.arrayBuffer);
  const { name: fileName, type: fileType } = file.file;

  // TODO migrate localStorage update to a subscription to track both policy and file changes centrally
  localStorage.setItem('virtru-demo-file', JSON.stringify({ b64, fileName, fileType, policy }));
};
const actions = {
  updateFile: (state, value) => {
    const policy = value.policy;
    updateLocalStorage(value, policy);
    return { file: value, policy };
  },
  updatePolicy: (state, value) => {
    const { file } = state;
    updateLocalStorage(file, value);
    return { policy: value };
  },
  updateUserId: (state, value) => ({ userId: value }),
  updateVirtruClient: (state, value) => ({ virtruClient: value }),
  updateEncrypted: (state, value) => ({ encrypted: value }),
  updateAuditEvents: (state, value) => ({ auditEvents: value }),
};

export default connect(
  mapToProps,
  actions,
)(Document);
