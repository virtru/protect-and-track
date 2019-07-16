import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'redux-zero/react';

import './App.css';
import Header from 'components/Header/Header';
import Document from 'scenes/Document/Document';
import { LOGIN_URL, LOGOUT_URL } from 'constants/api';

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
function App({ appIdBundle, setAppIdBundle, isLoading, setIsLoading, userId }) {
  return (
    <>
      <Header isLoggedIn={false} loginUrl={LOGIN_URL} logoutUrl={LOGOUT_URL} userId={userId} />
      <main className="main">
        <Router>
          <Route path="/" component={Document} />
          {/* TODO(dmihalcik): <Route 404 /> */}
        </Router>
      </main>
    </>
  );
}

const mapToProps = ({ appIdBundle, file, isLoading, userId }) => ({
  appIdBundle,
  file,
  isLoading,
  userId,
});
const actions = {
  setAppIdBundle: (state, value) => ({ appIdBundle: value }),
  setIsLoading: (state, value) => ({ isLoading: value }),
};

export default connect(
  mapToProps,
  actions,
)(App);
