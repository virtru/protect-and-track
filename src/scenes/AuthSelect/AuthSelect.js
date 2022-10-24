import React from 'react';
import { connect } from 'redux-zero/react';

import './AuthSelect.css';
import { IdentityProvider } from '@virtru/oidc-client-js';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';

const Authenticated = () => (
  <div>
    <div className="instruction">Your identity has been verified</div>
    <div className="authenticatedIcon" />
  </div>
);

const login = async (oidcClient, provider) => {
  oidcClient.loginWithRedirect(
    provider === 'microsoft' ? IdentityProvider.Microsoft : IdentityProvider.Google,
  );
};

function AuthSelect({ authState, oidcClient, onClose, setAuthState }) {
  return (
    <Modal onClose={onClose}>
      <div className="Auth-container">
        <div className="header">
          <div className="verticalSeparator" />
          <label>Authentication</label>
        </div>
        <div className="content">
          {(() => {
            switch (authState) {
              case 'loggedin':
                return <Authenticated />;
              default:
                return (
                  <div>
                    <div className="instruction">Virtru needs to verify your identity.</div>
                    <div className="oauthButtons">
                      <Button onClick={() => login(oidcClient, 'google')}>Google</Button>
                      <Button onClick={() => login(oidcClient, 'microsoft')}>microsoft</Button>
                    </div>
                  </div>
                );
            }
          })()}
        </div>
        <div className="footer">
          <div className="footerDivider" />
          <a className="tos" href="https://www.virtru.com/terms-of-service/">
            Terms of Service
          </a>
          <a className="tos" href="https://www.virtru.com/privacy-policy/">
            Privacy Policy
          </a>
          <a className="tos" href="https://www.virtru.com/intro/">
            About Virtru
          </a>
          <a className="tos" href="https://support.virtru.com/">
            Support
          </a>
          <label className="tos">&copy; Copyright 2022 Virtru Corporation</label>
        </div>
      </div>
    </Modal>
  );
}

const mapToProps = ({ oidcClient }) => ({ oidcClient });

export default connect(mapToProps)(AuthSelect);
