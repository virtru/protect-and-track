import React, { useEffect } from 'react';
import './AuthSelect.css';
import Modal from '../../components/Modal/Modal';
import anaylytics from '../../utils/analytics';

function AuthSelect({ onClose, login }) {
  useEffect(() => {
    console.log('Mounting auth UI...');
    window.Virtru.AuthWidget('virtru-auth-widget-mount', {
      afterAuth: () => {
        console.log('tracking');
        anaylytics.track({
          event: 'LoggedIn',
        });
        // login();
      },
    });
  }, [login]);

  return (
    <Modal raw onClose={onClose}>
      <div id="virtru-auth-widget-mount"></div>
    </Modal>
  );
}

export default AuthSelect;
