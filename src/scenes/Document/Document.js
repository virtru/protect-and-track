import React, { useState, useEffect } from 'react';
import { connect } from 'redux-zero/react/index';

import Sidebar from '../Sidebar/Sidebar';
import * as Virtru from 'virtru-sdk';
import { v4 as uuidv4 } from 'uuid';

import logAction from '../../utils/virtruActionLogger';
import Alert from './components/Alert/Alert';
import Drop from './components/Drop/Drop';
import Filename from './components/Filename/Filename';
import Policy from './scenes/Policy/Policy';
import { DownloadModal } from './scenes/DownloadModal/DownloadModal';
import Share from '../Share/Share';
import AuthSelect from '../AuthSelect/AuthSelect';
import StayUp from '../StayUp/StayUp';
import { generatePolicyChanger } from './scenes/Policy/services/policyChanger';
import { ENCRYPT_STATES } from '../../constants/encryptStates';
import localForage from 'localforage';

import './Document.css';

import { ReactComponent as FileIcon } from './assets/File-24.svg';
import { Button } from '../../components/Button/Button';
import { arrayBufferToBase64, fileToArrayBuffer } from '../../utils/buffer';

let auditTimerId;

function Document({
  authState,
  encryptState,
  encrypted,
  file,
  isAuthOpen,
  policy,
  policyId,
  userId,
  virtruClient,
  setAlert,
  setAuditEvents,
  setAuthOpen,
  setEncryptState,
  setEncrypted,
  setFile,
  setPolicy,
  setPolicyId,
}) {
  const [isShareOpen, setShareOpen] = useState(false);
  const [isStayUpOpen, setStayUpOpen] = useState(false);
  const [isDownloadOpen, setDownloadOpen] = useState(false);
  const [isPolicyRevoked, setPolicyRevoked] = useState(
    !!localStorage.getItem('virtru-demo-policyRevoked'),
  );

  const openStayUpModal = () => {
    setStayUpOpen(true);
  };

  const encrypt = async () => {
    setEncryptState(ENCRYPT_STATES.PROTECTING);
    let encryptResult;
    try {
      const buffer = new Uint8Array(file.arrayBuffer);
      const filename = file.file.name;

      /**** Virtru Block ****
       *
       * The following code shows how to encrypt a file. More details can be found here:
       * https://developer.virtru.com/docs/how-to-encrypt-a-file
       *
       *****/

      // Create a new encrypt parameters object which will be used to drive the encryption method
      logAction('buildVirtruEncryptionParams');
      const encryptParamsBuilder = new Virtru.EncryptParamsBuilder()
        .withBufferSource(buffer) // Specify the source, which will be encrypted, from buffer
        .withPolicy(policy) // Specify the policy which will be used for encryption
        .withDisplayFilename(filename); // Specify the filename which is displayed (since we're using a buffer)
      if (encryptParamsBuilder.setMimeType && file.type) {
        encryptParamsBuilder.setMimeType(file.type);
      }
      const encryptParams = encryptParamsBuilder.build();

      // Run the encryption and return a stream
      logAction('encryptToBuffer');
      const encryptedStream = await virtruClient.encrypt(encryptParams);

      // Convert the encryption stream to a buffer
      const encryptedFile = await encryptedStream.toBuffer();

      // Get the policy id from the built policy
      const policyId = encryptParams.getPolicyId();
      /**** END Virtru Block *****/

      encryptResult = {
        encryptedFile,
        policyId,
      };
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

    /**** Virtru Block ****
     *
     * The following code shows how to revoke a policy
     * https://developer.virtru.com/docs/how-to-add-virtru-controls#section--revoke-icon0-revoke
     *
     *****/

    logAction('revokePolicy');
    virtruClient.revokePolicy(policyId);

    /**** END Virtru Block ****/
  };

  useEffect(() => {
    async function updateAuditEvents() {
      const currentTimerId = auditTimerId;
      // Stop updating the audit log when policy or file changes
      if (encryptState !== ENCRYPT_STATES.PROTECTED) {
        return;
      }
      try {
        /**** Virtru Block ****
         *
         * The following code shows how to fetch events for a policy id=
         *
         *****/

        // Virtru: Fetch events for policy id
        const auditData = await virtruClient.fetchEventsForPolicyId(policyId);

        /**** END Virtru Block ****/

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
  }, [encryptState, policy, policyId, setAuditEvents, userId, virtruClient]);

  const renderDrop = () => {
    if (!file) {
      if (!isAuthOpen) {
        return <Drop userId={userId} setFile={setFile} />;
      }
      return (
        <>
          <Drop userId={userId} setFile={setFile} />
          <AuthSelect
            onClose={() => {
              setAuthOpen(false);
              setEncryptState(ENCRYPT_STATES.UNPROTECTED);
            }}
          />
        </>
      );
    }

    const policyChange = (change) => generatePolicyChanger(policy, setPolicy, change, policyId);
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
              setAuthOpen={setAuthOpen}
              encrypt={encrypt}
              encryptState={encryptState}
              policyChange={policyChange}
              authState={authState}
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
            onDragStart={(ev) => ev.dataTransfer.setData('text', 'demo-example.txt')}
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
  authState,
  encryptState,
  encrypted,
  file,
  policy,
  policyId,
  userId,
  virtruClient,
}) => ({
  authState,
  encryptState,
  encrypted,
  file,
  policy,
  policyId,
  userId,
  virtruClient,
});

const saveFileToLocalStorage = async ({ fileBuffer, fileName, fileType }) => {
  const b64 = arrayBufferToBase64(fileBuffer);

  // TODO migrate localStorage update to a subscription to track both policy and file changes centrally
  await localForage.setItem('virtru-demo-file', JSON.stringify({ b64, fileName, fileType }));
};

const savePolicyToLocalStorage = ({ policy }) => {
  const policyData = {
    /**** Virtru Block ****
     *
     * The following code shows how to get policy data
     * https://developer.virtru.com/docs/how-to-add-virtru-controls
     *
     *****/

    // Virtru: Get the policy authorizations
    authorizations: policy.getAuthorizations(),
    // Virtru: Get the policy expiration deadline
    expirationDeadline: policy.getExpirationDeadline(),
    // Virtru: Get the policy users who have access
    users: policy.getUsersWithAccess(),

    /**** END Virtru Block ****/
  };
  localStorage.setItem('virtru-demo-policy', JSON.stringify(policyData));
};

const saveEncryptedToLocalStorage = async ({ encryptedPayload, fileName, fileType }) => {
  const b64 = arrayBufferToBase64(encryptedPayload);
  await localForage.setItem(
    'virtru-demo-file-encrypted',
    JSON.stringify({ b64, name: fileName, type: fileType }),
  );
};

const actions = {
  setEncryptState: (state, value) => ({ encryptState: value }),

  setFile: async (state, { fileHandle, fileBuffer }) => {
    const { virtruClient } = state;
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
        /**** Virtru Block ****
         *
         * The following code shows how extract a policy id from an encrypted file
         * https://developer.virtru.com/docs/how-to-add-virtru-controls
         *
         *****/

        // Virtru: Create a decrypt params
        const decParams = new Virtru.DecryptParamsBuilder()
          // Set the buffer source for the encrypted data
          .withArrayBufferSource(fileBuffer)
          // Build the params
          .build();

        let client = virtruClient;
        // XXX Validate html files are not TDFs *after* a client is created, too.
        if (virtruClient) {
          // Virtru: Get the policy id from the decrypt params
          const id = decParams && (await client.getPolicyId(decParams));
          if (id) {
            return { alert: 'TDF support not yet implemented' };
          }
        }
        /**** END Virtru Block ****/
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

    /**** Virtru Block ****
     *
     * The following code shows how to create a new policy, add the current user to access
     * https://docs.developer.virtru.com/js/latest/PolicyBuilder.html
     *
     */
    logAction('createPolicyBuilder');
    // Virtru: Create a new policy builder
    const policy = new Virtru.PolicyBuilder().withPolicyId(uuidv4()).build();
    /**** END Virtru Block ****/

    await saveFileToLocalStorage({ fileName, fileType, fileBuffer });
    savePolicyToLocalStorage({ policy });
    return {
      file: { file: fileHandle, arrayBuffer: fileBuffer },
      policy,
      encrypted,
      encryptState,
      auditEvents: false,
    };
  },
  setEncrypted: async (state, value) => {
    const { payload, name, type } = value;
    await saveEncryptedToLocalStorage({
      encryptedPayload: payload,
      fileName: name,
      fileType: type,
    });
    return { encrypted: value, auditEvents: false };
  },
  setPolicy: (state, policy) => {
    const { encrypted, virtruClient } = state;
    if (encrypted && virtruClient && policy) {
      /**** Virtru Block ****
       *
       * The following code shows how to update a policy
       * https://docs.developer.virtru.com/js/latest/Client.html#updatePolicy
       *
       */
      logAction('updatePolicy');
      // Virtru: Update the policy
      virtruClient.updatePolicy(policy);
      /**** END Virtru Block ****/
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

      /**** Virtru Block ****
       *
       * The following code shows how to create a policy with an id
       * https://docs.developer.virtru.com/js/latest/PolicyBuilder.html
       *
       */
      if (policy && value !== policy.getPolicyId()) {
        // Virtru: Build a policy with an id
        policy = policy.builder().withPolicyId(value).build();
      }
      /**** END Virtru Block ****/
    } else {
      localStorage.setItem('virtru-demo-policyId', value);
    }
    return { policy, policyId: value };
  },
};

export default connect(mapToProps, actions)(Document);
