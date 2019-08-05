import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'redux-zero/react';

import './App.css';
import Header from 'components/Header/Header';
import Document from 'scenes/Document/Document';

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
  setIsLoading,
  userId,
  isMobile,
  isSupportedBrowser,
  continueAnyway,
  setContinueAnyway,
}) {
  const isSupported = !isMobile && isSupportedBrowser;
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
  userId,
  isMobile,
  isSupportedBrowser,
  continueAnyway,
}) => ({
  appIdBundle,
  file,
  isLoading,
  userId,
  isMobile,
  isSupportedBrowser,
  continueAnyway,
});
const actions = {
  setAppIdBundle: (state, value) => ({ appIdBundle: value }),
  setIsLoading: (state, value) => ({ isLoading: value }),
  setContinueAnyway: () => {
    localStorage.setItem('continueAnyway', 'true');
    return { continueAnyway: true };
  },
};

export default connect(
  mapToProps,
  actions,
)(App);
