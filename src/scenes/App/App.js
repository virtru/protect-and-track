import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';
import Header from 'components/Header/Header';
import Document from 'scenes/Document/Document';
import { getAppIdBundle, getLoginUrl, getLogoutUrl } from 'api/accounts';
import { connect } from 'redux-zero/react';

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
function App({ appIdBundle, setAppIdBundle }) {
  console.log(appIdBundle);
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    async function login() {
      const appIdBundle = await getAppIdBundle();
      setAppIdBundle(appIdBundle);
    }
    if (!appIdBundle) {
      login();
    }
  });

  // if (!appIdBundle) {
  //   return <h1 className="loading-text">Loading...</h1>;
  // }

  return (
    <>
      <Header
        isLoggedIn={appIdBundle && appIdBundle.length}
        loginUrl={getLoginUrl()}
        logoutUrl={getLogoutUrl()}
      />
      <main className="main">
        <Router>
          <Route path="/" component={Document} />
          {/* TODO(dmihalcik): <Route 404 /> */}
        </Router>
      </main>
    </>
  );
}

const mapToProps = ({ appIdBundle, file }) => ({ appIdBundle, file });
const actions = {
  setAppIdBundle: (state, value) => ({ appIdBundle: value }),
};

const connected = connect(
  mapToProps,
  actions,
)(App);

export { connected as default, App as Pure };
