import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';
import AuthSelect from 'scenes/AuthSelect/AuthSelect';
import Drop from 'scenes/Drop/Drop';
import ShareSelect from 'scenes/Share/Share';
import UserSelect from 'scenes/UserSelect/UserSelect';

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
function App() {
  return (
    <Router>
      <Route path="/" exact component={UserSelect} />
      <Route
        path="/auth"
        component={({ location }) => {
          const params = new URLSearchParams(location.search);
          return <AuthSelect userId={params.get('id')} />;
        }}
      />
      <Route
        path="/drop"
        component={({ location }) => {
          const params = new URLSearchParams(location.search);
          return <Drop userId={params.get('id')} />;
        }}
      />
      <Route path="/share" exact component={ShareSelect} />
      {/* TODO(dmihalcik): <Route 404 /> */}
    </Router>
  );
}

export default App;
