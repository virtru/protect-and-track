import React, { useEffect } from 'react';
import { connect } from 'redux-zero/react/index';
import * as Virtru from 'virtru-sdk';

import './AuthSelect.css';
import { authOptions, clientConfig } from '../../utils/config';
import { Modal } from '../../components/Modal/Modal';

const login = async (state, userId) => {
  // Just refresh with the email query param
  localStorage.setItem('virtru-demo-email', userId);
  state.userId = userId;
  state.authState = 'loggedin';
  state.virtruClient = new Virtru.Client({ ...clientConfig, email: userId });
  return state;
};

function AuthSelect({ login, onClose, userId }) {
  useEffect(() => {
    console.log('Mounting auth UI...');
    window.Virtru.AuthWidget('virtru-auth-widget-mount', {
      afterAuth: (userId) => login(userId),
      authOptions,
    });
  }, [login, userId]);

  return (
    <Modal onClose={onClose}>
      <div id="virtru-auth-widget-mount"></div>
    </Modal>
  );
}

export default connect(({ userId }) => ({ userId }), { login })(AuthSelect);
