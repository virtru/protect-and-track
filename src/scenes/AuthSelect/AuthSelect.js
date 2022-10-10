import React, { useEffect } from 'react';
import './AuthSelect.css';
import { authOptions } from '../../utils/config.js';
import { Modal } from '../../components/Modal/Modal.js';

function AuthSelect({ onClose, login }) {
  useEffect(() => {
    console.log('Mounting auth UI...');
    window.Virtru.AuthWidget('virtru-auth-widget-mount', {
      afterAuth: login,
      authOptions,
    });
  }, [login]);

  return (
    <Modal onClose={onClose}>
      <div id="virtru-auth-widget-mount"></div>
    </Modal>
  );
}

export default AuthSelect;
