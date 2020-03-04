import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'redux-zero/react';
import ENCRYPT_STATES from 'constants/encryptStates';
import { base64ToArrayBuffer } from 'utils/buffer';
import Virtru from 'utils/sdk';
import uuid from 'uuid';

import './App.css';
import Header from 'components/Header/Header';
import Document from 'scenes/Document/Document';
import localForage from 'localforage';

const useEffect = React.useEffect;

/**
 * An SDK Share App.
 * This will have several children:
 *  - an authorization panel, for selecting the current entity and assigning an entity token
 *  - A TDF details panel, for displaying information about an encrypted object
 *  - An Dev panel, for details about:
 *     + what API methods are invoked
 *     + audit events for the policy
 *  - Additional helper text and overlays
 *  - share panel?
 */
function App({
  appIdBundle,
  setAppIdBundle,
  isLoading,
  isLoggedIn,
  setIsLoading,
  updateFileData,
  userId,
  isMobile,
  isSupportedBrowser,
  continueAnyway,
  setContinueAnyway,
}) {
  const isSupported = !isMobile && isSupportedBrowser;

  useEffect(() => {
    async function fetchFileState() {
      if (!isLoading) {
        return;
      }

      let encResults = await getEncryptedFile();
      let fileData = await getFileData();

      updateFileData({
        ...encResults,
        ...fileData,
      });

      setIsLoading(false);
    }

    fetchFileState();
  }, [isLoading, setIsLoading, isLoggedIn, updateFileData]);

  if (isSupported || continueAnyway) {
    return (
      <>
        <Header isLoggedIn={false} userId={userId} />
        <main className="main">
          <Router>
            <Route path="/" component={Document} />
            {/* TODO(dmihalcik): <Route 404 /> */}
          </Router>
        </main>
      </>
    );
  }

  return (
    <div className="unsupportedWrapper">
      <h3>Please view this demo on a desktop computer or tablet in Chrome.</h3>
      <a className="button mainButton" href="https://developer.virtru.com/">
        Back to Developer Hub
      </a>
      <button type="button" className="button alternateButton" onClick={() => setContinueAnyway()}>
        Continue Anyway
      </button>
    </div>
  );
}

const mapToProps = ({
  appIdBundle,
  file,
  isLoading,
  isLoggedIn,
  userId,
  isMobile,
  isSupportedBrowser,
  continueAnyway,
}) => ({
  appIdBundle,
  file,
  isLoading,
  isLoggedIn,
  userId,
  isMobile,
  isSupportedBrowser,
  continueAnyway,
});

const actions = {
  setAppIdBundle: (state, value) => ({ appIdBundle: value }),
  setIsLoading: (state, value) => ({ isLoading: value }),
  updateFileData: (state, value) => {
    console.log('Value: ');
    console.log({ ...value });
    return { ...value };
  },
  setContinueAnyway: () => {
    localStorage.setItem('continueAnyway', 'true');
    return { continueAnyway: true };
  },
};

async function getEncryptedFile(isLoggedIn) {
  let encrypted;
  let encryptState;
  try {
    const rawEncryptedFileData = await localForage.getItem('virtru-demo-file-encrypted');
    const encryptedFileData = JSON.parse(rawEncryptedFileData);

    // Restore existing encrypted file
    if (encryptedFileData) {
      const buffer = encryptedFileData && base64ToArrayBuffer(encryptedFileData.b64);
      encrypted = {
        payload: buffer,
        name: encryptedFileData.name,
        type: encryptedFileData.type,
      };
      encryptState = isLoggedIn ? ENCRYPT_STATES.PROTECTED : ENCRYPT_STATES.PROTECTED_NO_AUTH;
    }
  } catch (err) {
    console.error(err);
  }
  return { encrypted, encryptState };
}

async function getFileData() {
  const policyData = JSON.parse(localStorage.getItem('virtru-demo-policy'));
  let policyId = localStorage.getItem('virtru-demo-policyId');

  const rawFileData = await localForage.getItem('virtru-demo-file');
  const fileData = JSON.parse(rawFileData);

  let file;
  let policy;

  try {
    // Restore existing file
    if (fileData) {
      const buffer = fileData.b64 && base64ToArrayBuffer(fileData.b64);
      file = {
        arrayBuffer: buffer,
        file: {
          name: fileData.fileName,
          type: fileData.fileType,
        },
      };

      // Virtru: create a new policy builder
      const builder = new Virtru.PolicyBuilder();
      builder.setPolicyId(uuid.v4());
      if (policyData !== null && typeof policyData === 'object') {
        if (policyId) {
          // Virtru: restore policy id from localstorage
          builder.setPolicyId(policyId);
        }
        if (!policyData.authorizations.includes('forward')) {
          // Virtru: disable resharing
          builder.disableReshare();
        }
        if (policyData.expirationDeadline) {
          // Virtru: enable expiration deadline
          builder.enableExpirationDeadline(policyData.expirationDeadline);
        }
        if (policyData.users.length > 0) {
          // Virtru: add users with access to policy
          builder.addUsersWithAccess(...policyData.users);
        }
      }
      // Virtru: build the policy
      policy = builder.build();
    }
  } catch (err) {
    console.error(err);
  }
  return {
    file,
    policy,
    policyId,
  };
}

export default connect(
  mapToProps,
  actions,
)(App);
