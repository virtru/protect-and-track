import React, { useState, useEffect } from 'react';
import { connect } from 'redux-zero/react/index';

import Sidebar from '../Sidebar/Sidebar';

import * as tdf from 'utils/tdfWrapper';
import Drop from './components/Drop/Drop';
import Filename from './components/Filename/Filename';
import Policy from './scenes/Policy/Policy';
import { getAuditEvents } from 'services/audit';
import Share from '../Share/Share';
import AuthSelect from '../AuthSelect/AuthSelect';
import ENCRYPT_STATES from 'constants/encryptStates';

import './Document.css';
import downloadHtml from '../../utils/downloadHtml';
import Button from '../../components/Button/Button';
import { arrayBufferToBase64, fileToArrayBuffer } from '../../utils/buffer';

function Document({
  file,
  setFile,
  userId,
  appId,
  setUserId,
  virtruClient,
  setVirtruClient,
  encrypted,
  setEncrypted,
  auditEvents,
  setAuditEvents,
  encryptState,
  setEncryptState,
}) {
  const [isShareOpen, setShareOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (!userId || virtruClient) {
        return;
      }
      const client = await tdf.authenticate(userId);
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

  const loginAs = async email => {
    const client = await tdf.authenticate(email);
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
    const { encryptedFile, policyId } = await tdf.encrypt({
      client: virtruClient,
      fileData: file.data,
      filename: file.file.name,
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
    const loadEncrypted = ({ fileName, fileType, fileBuffer }) => {};
    if (!file) {
      return <Drop userId={userId} setFile={setFile} loadEncrypted={loadEncrypted} />;
    }

    return (
      <>
        <Drop userId={userId} setFile={setFile} loadEncrypted={loadEncrypted}>
          <div className="DocumentDetails">
            <Filename file={file} isTdf={!!encrypted} />
            <Policy
              file={file}
              userId={userId}
              openAuthModal={openAuthModal}
              encrypt={encrypt}
              encryptState={encryptState}
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
        <Button
          variant="link"
          onClick={() => downloadHtml(encrypted)}
          disabled={!encrypted || !userId}
        >
          Download
        </Button>
        <Button onClick={() => setShareOpen(true)} disabled={!encrypted || !userId}>
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

const mapToProps = ({
  file,
  userId,
  appId,
  virtruClient,
  encrypted,
  auditEvents,
  encryptState,
}) => ({
  file,
  userId,
  appId,
  virtruClient,
  auditEvents,
  encrypted,
  encryptState,
});

const actions = {
  setFile: async (state, fileHandle) => {
    localStorage.removeItem('virtru-demo-file');
    localStorage.removeItem('virtru-demo-file-encrypted');
    const { name: fileName, type: fileType } = fileHandle;
    const fileBuffer = await fileToArrayBuffer(fileHandle);
    let encryptState = ENCRYPT_STATES.UNPROTECTED;
    let encrypted = false;

    // Attempt to parse as TDF
    if (fileName.endsWith('.html')) {
      try {
        const htmlText = new TextDecoder('utf-8').decode(fileBuffer);
        const encryptedPayload = tdf.unwrapHtml(htmlText);
        encrypted = {
          payload: encryptedPayload,
          name: fileName,
          type: fileType,
        };
        if (state.userId) {
          encryptState = ENCRYPT_STATES.PROTECTED;
        } else {
          encryptState = ENCRYPT_STATES.PROTECTED_NO_AUTH;
        }
        const b64 = arrayBufferToBase64(encryptedPayload);
        localStorage.setItem(
          'virtru-demo-file-encrypted',
          JSON.stringify({ b64, name: fileName, type: fileType }),
        );
      } catch (err) {
        console.error('unwrapHtml failed', err);
      }
    }

    const b64 = arrayBufferToBase64(fileBuffer);
    localStorage.setItem('virtru-demo-file', JSON.stringify({ b64, fileName, fileType }));
    return { file: { file: fileHandle, arrayBuffer: fileBuffer }, encryptState, encrypted };
  },
  setUserId: (state, value) => ({ userId: value }),
  setVirtruClient: (state, value) => ({ virtruClient: value }),
  setEncrypted: (state, value) => {
    console.log(value);
    const { payload, name, type } = value;
    const b64 = arrayBufferToBase64(payload);
    localStorage.setItem('virtru-demo-file-encrypted', JSON.stringify({ b64, name, type }));
    return { encrypted: value };
  },
  setAuditEvents: (state, value) => ({ auditEvents: value }),
  setEncryptState: (state, value) => ({ encryptState: value }),
};

export default connect(
  mapToProps,
  actions,
)(Document);
