import React, { useEffect } from 'react';
import './AuthSelect.css';
import Modal from '../../components/Modal/Modal';
import analytics, { EVENT_NAMES } from 'utils/analytics';

function AuthSelect({ onClose, login }) {
  useEffect(() => {
    console.log('Mounting auth UI...');
    analytics.track({ event: EVENT_NAMES.LOGIN_ATTEMPT });
    window.Virtru.AuthWidget('virtru-auth-widget-mount', {
      afterAuth: login,
    });
  }, [login]);

  return (
    <Modal onClose={onClose}>
      <div id="virtru-auth-widget-mount"></div>
    </Modal>
  );
}

export default AuthSelect;
