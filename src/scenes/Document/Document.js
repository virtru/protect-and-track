// MIT License
//
// Copyright (c) 2019 Virtru Corporation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import React, { useState, useEffect } from 'react';
import { connect } from 'redux-zero/react/index';

import Sidebar from '../Sidebar/Sidebar';

import Virtru from 'utils/VirtruWrapper';
import Alert from './components/Alert/Alert';
import Drop from './components/Drop/Drop';
import Filename from './components/Filename/Filename';
import Policy from './scenes/Policy/Policy';
import DownloadModal from './scenes/DownloadModal/DownloadModal';
import Share from '../Share/Share';
import AuthSelect from '../AuthSelect/AuthSelect';
import StayUp from '../StayUp/StayUp';
import { generatePolicyChanger } from './scenes/Policy/services/policyChanger';
import ENCRYPT_STATES from 'constants/encryptStates';

import './Document.css';

import { ReactComponent as FileIcon } from './assets/File-24.svg';
import Button from '../../components/Button/Button';
import { arrayBufferToBase64, fileToArrayBuffer } from '../../utils/buffer';

let auditTimerId;

function Document({
  policyId,
  appId,
  encrypted,
  file,
  policy,
  userId,
  virtruClient,
  encryptState,
  setAlert,
  setFile,
  setEncrypted,
  setAuditEvents,
  setEncryptState,
  setPolicy,
  setPolicyId,
  isLoggedIn,
}) {
  const [isShareOpen, setShareOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [isStayUpOpen, setStayUpOpen] = useState(false);
  const [isDownloadOpen, setDownloadOpen] = useState(false);
  const [isPolicyRevoked, setPolicyRevoked] = useState(
    !!localStorage.getItem('virtru-demo-policyRevoked'),
  );

  const openAuthModal = () => {
    setEncryptState(ENCRYPT_STATES.AUTHENTICATING);
    setAuthOpen(true);
  };

  const openStayUpModal = () => {
    setStayUpOpen(true);
  };

  const login = async email => {
    // Just refresh with the email query param
    localStorage.setItem('virtru-demo-email', email);
    window.location.reload();
  };

  const encrypt = async () => {
    setEncryptState(ENCRYPT_STATES.PROTECTING);
    let encryptResult;
    try {
      encryptResult = await Virtru.encrypt({
        client: virtruClient,
        fileData: file.arrayBuffer,
        filename: file.file.name,
        policy,
        userEmail: userId,
        asHtml: true,
      });
    } catch (e) {
      // Encryption failed!!!!
      setEncryptState(ENCRYPT_STATES.UNPROTECTED);
      console.warn({ type: 'encrypt failure', cause: e });
      if (e && e.message) {
        if (e.message === 'Encrypting as a CKS-enabled user is currently not supported.') {
          setAlert(' Please use a non-corporate account. CKS key server support coming soon.');
        } else {
          setAlert(`Encrypt service error: ${e.message}`);
        }
      } else {
        setAlert('Encrypt service error; try refreshing credentials or starting over.');
      }
      return;
    }
    // TODO fetch policy instead of updating the exisitng copy here
    const { encryptedFile, policyId } = encryptResult;
    setPolicyId(policyId);
    setEncrypted({
      payload: encryptedFile,
      name: `${file.file.name}.html`,
      type: file.file.type,
    });
    setEncryptState(ENCRYPT_STATES.PROTECTED);
    if (auditTimerId) {
      window.clearTimeout(auditTimerId);
    }
  };

  const revokePolicy = () => {
    localStorage.setItem('virtru-demo-policyRevoked', true);
    setPolicyRevoked(true);
    // TODO: handle error case?
    Virtru.revoke({ virtruClient, policyId });
  };

  useEffect(() => {
    async function updateAuditEvents() {
      const currentTimerId = auditTimerId;
      // Stop updating the audit log when policy or file changes
      if (encryptState !== ENCRYPT_STATES.PROTECTED) {
        return;
      }
      try {
        const auditData = await Virtru.fetchAuditEvents({ virtruClient, policyId });
        setAuditEvents({ events: auditData, error: false });
      } catch (err) {
        console.error(err);
        setAuditEvents({ error: err });
      }
      if (currentTimerId !== auditTimerId) {
        // The policy changed while waiting for the audit log, so don't update it.
        return;
      }
      auditTimerId = setTimeout(updateAuditEvents, 2000);
    }
    if (auditTimerId) {
      // Clear the existing timer
      window.clearTimeout(auditTimerId);
    }
    if (!policyId || encryptState !== ENCRYPT_STATES.PROTECTED) {
      // We aren't connected to a document with a policy on the ACM service
      return;
    }
    auditTimerId = setTimeout(updateAuditEvents, 2000);
  }, [appId, encryptState, policy, policyId, setAuditEvents, userId, virtruClient]);

  const renderDrop = () => {
    if (!file) {
      return <Drop userId={userId} setFile={setFile} />;
    }

    const policyChange = change => generatePolicyChanger(policy, setPolicy, change, policyId);
    return (
      <>
        <Drop
          policyState={encryptState === ENCRYPT_STATES.PROTECTED ? 'encrypted' : 'plain'}
          userId={userId}
          setFile={setFile}
        >
          <div className="DocumentDetails">
            <Filename
              file={file}
              isTdf={!!encrypted}
              isPolicyRevoked={isPolicyRevoked}
              revokePolicy={revokePolicy}
              userId={userId}
            />
            <Policy
              virtruClient={virtruClient}
              file={file}
              policy={policy}
              policyId={policyId}
              isPolicyRevoked={isPolicyRevoked}
              userId={userId}
              openAuthModal={openAuthModal}
              encrypt={encrypt}
              encryptState={encryptState}
              policyChange={policyChange}
              isLoggedIn={isLoggedIn}
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
            login={login}
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
          <div
            draggable="true"
            onDragStart={ev => ev.dataTransfer.setData('text', 'demo-example.txt')}
          >
            <FileIcon className="file-icon" />
            demo-example.txt
          </div>
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
            onClick={() => setDownloadOpen(true)}
            disabled={!encrypted || !userId}
          >
            Download
          </Button>
          <Button
            onClick={() => setShareOpen(true)}
            disabled={
              !encrypted ||
              !userId ||
              !policy ||
              isPolicyRevoked ||
              !policy.getUsersWithAccess().length
            }
          >
            Share
          </Button>
        </div>
        {isDownloadOpen && (
          <DownloadModal
            virtruClient={virtruClient}
            onClose={() => setDownloadOpen(false)}
            encrypted={encrypted}
          />
        )}
      </section>
    );
  };

  return (
    <>
      <div className="DocumentWrapper">
        {renderDrop()}
        <Alert />
        {renderButtons()}
      </div>
      <Sidebar />
    </>
  );
}

const mapToProps = ({
  policyId,
  file,
  appId,
  encrypted,
  encryptState,
  policy,
  userId,
  virtruClient,
  isLoggedIn,
}) => ({
  policyId,
  file,
  policy,
  userId,
  appId,
  virtruClient,
  encrypted,
  encryptState,
  isLoggedIn,
});

const saveFileToLocalStorage = ({ fileBuffer, fileName, fileType }) => {
  const b64 = arrayBufferToBase64(fileBuffer);

  // TODO migrate localStorage update to a subscription to track both policy and file changes centrally
  localStorage.setItem('virtru-demo-file', JSON.stringify({ b64, fileName, fileType }));
};

const savePolicyToLocalStorage = ({ policy }) => {
  const policyData = {
    authorizations: policy.getAuthorizations(),
    expirationDeadline: policy.getExpirationDeadline(),
    users: policy.getUsersWithAccess(),
  };
  localStorage.setItem('virtru-demo-policy', JSON.stringify(policyData));
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
    const { userId, virtruClient } = state;
    const { name: fileName, type: fileType } = fileHandle || {};
    if (!fileBuffer && fileHandle) {
      fileBuffer = await fileToArrayBuffer(fileHandle);
    }

    // If the file is invalid, don't bother clearing anything.
    // TODO() Here is a good place to test for size?

    // Attempt to parse as TDF. If successful, load as encrypted data.
    if (fileName && fileName.endsWith('.tdf')) {
      // TODO handle TDF files
      return { alert: 'TDF support not yet implemented' };
    } else if (fileName && fileName.endsWith('.html')) {
      // maybe a TDF?
      try {
        const decParams = Virtru.newVirtruDecryptParamsBuilder()
          .withArrayBufferSource(fileBuffer)
          .build();
        // TODO find a more elegant way to do this
        const client = virtruClient || Virtru.createClient({ email: userId || 'a@b.invalid' });
        const uuid = decParams && (await client.getPolicyId(decParams));
        if (uuid) {
          return { alert: 'TDF support not yet implemented' };
        }
      } catch (e) {
        // TODO use a real API for this instead.
        console.info({ type: 'This HTML file probably does not contain a TDF', cause: e });
      }
    }

    if (auditTimerId) {
      window.clearTimeout(auditTimerId);
    }
    localStorage.removeItem('virtru-demo-file');
    localStorage.removeItem('virtru-demo-policy');
    localStorage.removeItem('virtru-demo-file-encrypted');
    localStorage.removeItem('virtru-demo-policyId');
    localStorage.removeItem('virtru-demo-policyRevoked');
    if (!fileHandle) {
      return {
        file: false,
        policy: false,
        encrypted: false,
        encryptState: false,
        auditEvents: false,
      };
    }
    let encryptState = ENCRYPT_STATES.UNPROTECTED;
    let encrypted = false;

    const policyBuilder = Virtru.policyBuilder();
    // Add the current user if present
    if (userId) {
      policyBuilder.addUsersWithAccess(userId);
    }
    const policy = policyBuilder.build();

    saveFileToLocalStorage({ fileName, fileType, fileBuffer });
    savePolicyToLocalStorage({ policy });
    return {
      file: { file: fileHandle, arrayBuffer: fileBuffer },
      policy,
      encrypted,
      encryptState,
      auditEvents: false,
    };
  },
  setEncrypted: (state, value) => {
    const { payload, name, type } = value;
    saveEncryptedToLocalStorage({ encryptedPayload: payload, fileName: name, fileType: type });
    return { encrypted: value, auditEvents: false };
  },
  setEncryptState: (state, value) => ({ encryptState: value }),
  setPolicy: (state, policy) => {
    const { encrypted, virtruClient } = state;
    if (encrypted && virtruClient && policy) {
      Virtru.updatePolicy(virtruClient, policy);
    }
    savePolicyToLocalStorage({ policy });
    return { policy };
  },
  setAuditEvents: ({ auditEvents: oldAuditEvents }, value) => {
    if (!value) {
      if (value === oldAuditEvents) {
        return {};
      }
    } else if (value.error) {
      // if we currently have an error, update the error state only.
      value = { ...value, events: oldAuditEvents.events };
    } else if (value.events) {
      if (value.events.length === oldAuditEvents) {
        return {};
      }
    }
    return { auditEvents: value };
  },
  setAlert: (state, value) => {
    return { alert: value };
  },
  setPolicyId: (state, value) => {
    let { policy, policyId } = state;
    if (policyId === value) {
      return {};
    }
    if (!value) {
      localStorage.removeItem('virtru-demo-policyId');
      if (policy && value !== policy.getPolicyId()) {
        policy = policy
          .builder()
          .withPolicyId(value)
          .build();
      }
    } else {
      localStorage.setItem('virtru-demo-policyId', value);
    }
    return { policy, policyId: value };
  },
};

export default connect(
  mapToProps,
  actions,
)(Document);
