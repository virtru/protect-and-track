import React, { useState, useEffect } from 'react';
import { connect } from 'redux-zero/react/index';

import Sidebar from '../Sidebar/Sidebar';

import Virtru from 'utils/VirtruWrapper';
import Drop from './components/Drop/Drop';
import Filename from './components/Filename/Filename';
import Policy from './scenes/Policy/Policy';
import { getAuditEvents } from 'services/audit';
import Share from '../Share/Share';
import AuthSelect from '../AuthSelect/AuthSelect';
import StayUp from '../StayUp/StayUp';
import ENCRYPT_STATES from 'constants/encryptStates';

import './Document.css';

import { ReactComponent as FileIcon } from './assets/File-24.svg';
import downloadHtml from '../../utils/downloadHtml';
import Button from '../../components/Button/Button';
import { arrayBufferToBase64, fileToArrayBuffer } from '../../utils/buffer';

function Document({
  appId,
  encrypted,
  file,
  policy,
  userId,
  virtruClient,
  encryptState,
  setFile,
  setUserId,
  setVirtruClient,
  setEncrypted,
  setAuditEvents,
  setEncryptState,
  setPolicy,
}) {
  const [isShareOpen, setShareOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [isStayUpOpen, setStayUpOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (!userId || virtruClient) {
        return;
      }
      const client = await Virtru.authenticate(userId);
      setVirtruClient(client);
      if (!encrypted) {
        setEncryptState(ENCRYPT_STATES.UNPROTECTED);
      } else {
        setEncryptState(ENCRYPT_STATES.PROTECTED);
      }
    })();
  }, [userId, setVirtruClient, virtruClient, setEncryptState, encrypted]);

  const openAuthModal = () => {
    setEncryptState(ENCRYPT_STATES.AUTHENTICATING);
    setAuthOpen(true);
  };

  const openStayUpModal = () => {
    setStayUpOpen(true);
  };

  const loginAs = async email => {
    const client = await Virtru.authenticate(email);
    setUserId(email);
    setVirtruClient(client);
    if (!encrypted) {
      setEncryptState(ENCRYPT_STATES.UNPROTECTED);
    } else {
      setEncryptState(ENCRYPT_STATES.PROTECTED);
    }
    setAuthOpen(false);
  };

  const encrypt = async () => {
    setEncryptState(ENCRYPT_STATES.PROTECTING);
    const { encryptedFile, policyId } = await Virtru.encrypt({
      client: virtruClient,
      fileData: file.arrayBuffer,
      filename: file.file.name,
      policy: policy,
      userEmail: userId,
      asHtml: true,
    });
    setEncrypted({
      payload: encryptedFile,
      name: `${file.file.name}.html`,
      type: file.file.type,
    });
    setEncryptState(ENCRYPT_STATES.PROTECTED);
    setInterval(async () => {
      const auditRes = await getAuditEvents({ userId, appId, policyId });
      const auditData = await auditRes.json();
      setAuditEvents(auditData.data);
    }, 2000);
  };

  const renderDrop = () => {
    if (!file) {
      return <Drop userId={userId} setFile={setFile} />;
    }

    return (
      <>
        <Drop
          policyState={encryptState === ENCRYPT_STATES.PROTECTED ? 'encrypted' : 'plain'}
          userId={userId}
          setFile={setFile}
        >
          <div className="DocumentDetails">
            <Filename file={file} isTdf={!!encrypted} />
            <Policy
              file={file}
              policy={policy}
              userId={userId}
              openAuthModal={openAuthModal}
              encrypt={encrypt}
              encryptState={encryptState}
              setPolicy={setPolicy}
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
        {isStayUpOpen && (
          <StayUp
            onClose={() => {
              setStayUpOpen(false);
            }}
            userId={userId}
          />
        )}
      </>
    );
  };

  const renderButtons = () => {
    if (!file) {
      return (
        <section className="DocumentFooter center">
          <span>or drag this... </span>
          <h3 draggable="true">
            <FileIcon className="file-icon" />
            demo-example.txt
          </h3>
        </section>
      );
    }

    return (
      <section className="DocumentFooter">
        {userId && (
          <Button variant="link" onClick={() => openStayUpModal()}>
            Stay Up to Date
          </Button>
        )}
        <div className="DocumentFooterButtons">
          <Button
            variant="link"
            onClick={() => downloadHtml(encrypted)}
            disabled={!encrypted || !userId}
          >
            Download
          </Button>
          <Button
            onClick={() => setShareOpen(true)}
            disabled={!encrypted || !userId || !policy || !policy.getUsers().length}
          >
            Share
          </Button>
        </div>
      </section>
    );
  };

  return (
    <>
      <div className="DocumentWrapper">
        {renderDrop()}
        {renderButtons()}
      </div>
      <Sidebar />
    </>
  );
}

const mapToProps = ({
  file,
  appId,
  encrypted,
  auditEvents,
  encryptState,
  policy,
  userId,
  virtruClient,
}) => ({
  file,
  policy,
  userId,
  appId,
  virtruClient,
  auditEvents,
  encrypted,
  encryptState,
});

const saveFileToLocalStorage = ({ fileBuffer, fileName, fileType, policy }) => {
  const b64 = arrayBufferToBase64(fileBuffer);

  // TODO migrate localStorage update to a subscription to track both policy and file changes centrally
  localStorage.setItem('virtru-demo-file', JSON.stringify({ b64, fileName, fileType, policy }));
};

const saveEncryptedToLocalStorage = ({ encryptedPayload, fileName, fileType }) => {
  const b64 = arrayBufferToBase64(encryptedPayload);
  localStorage.setItem(
    'virtru-demo-file-encrypted',
    JSON.stringify({ b64, name: fileName, type: fileType }),
  );
};

const actions = {
  setFile: async (state, { fileHandle, fileBuffer }) => {
    localStorage.removeItem('virtru-demo-file');
    localStorage.removeItem('virtru-demo-file-encrypted');
    const { userId } = state;
    const { name: fileName, type: fileType } = fileHandle;
    fileBuffer = fileBuffer || (await fileToArrayBuffer(fileHandle));
    let encryptState = ENCRYPT_STATES.UNPROTECTED;
    let encrypted = false;

    const policyBuilder = Virtru.policyBuilder();
    // Add the current user if present
    if (userId) {
      policyBuilder.addUsers(userId);
    }
    const policy = policyBuilder.build();

    // Attempt to parse as TDF. If successful, load as encrypted data.
    if (fileName.endsWith('.html')) {
      const htmlText = new TextDecoder('utf-8').decode(fileBuffer);
      if (Virtru.unwrapHtml(htmlText)) {
        encrypted = {
          payload: fileBuffer,
          name: fileName,
          type: fileType,
        };
        if (state.userId) {
          encryptState = ENCRYPT_STATES.PROTECTED;
        } else {
          encryptState = ENCRYPT_STATES.PROTECTED_NO_AUTH;
        }
        saveEncryptedToLocalStorage({ encryptedPayload: fileBuffer, fileName, fileType });
      }
    }

    saveFileToLocalStorage({ fileName, fileType, fileBuffer, policy });
    return { file: { file: fileHandle, arrayBuffer: fileBuffer }, policy, encrypted, encryptState };
  },
  setUserId: (state, value) => ({ userId: value }),
  setVirtruClient: (state, value) => ({ virtruClient: value }),
  setEncrypted: (state, value) => {
    const { payload, name, type } = value;
    saveEncryptedToLocalStorage({ encryptedPayload: payload, fileName: name, fileType: type });
    return { encrypted: value };
  },
  setEncryptState: (state, value) => ({ encryptState: value }),
  setPolicy: (state, policy) => {
    const { file } = state;
    const { name: fileName, type: fileType } = file.file;
    const fileBuffer = file.arrayBuffer;
    saveFileToLocalStorage({ fileBuffer, fileName, fileType, policy });
    return { policy };
  },
  setAuditEvents: (state, value) => ({ auditEvents: value }),
};

export default connect(
  mapToProps,
  actions,
)(Document);
