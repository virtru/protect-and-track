import React, { useState, useEffect } from 'react';
import './AuthSelect.css';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
// import Virtru from 'utils/VirtruWrapper';

const AUTH_STEPS = {
  ENTER_EMAIL: 0,
  CHOOSE_PROVIDER: 1,
  ENTER_CODE: 2,
};

function validateEmail(email) {
  // eslint-disable-next-line no-useless-escape
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function AuthSelect({ onClose, login }) {
  useEffect(() => {
    console.log('Mounting auth UI...');
    window.Virtru.AuthWidget('virtru-auth-widget-mount', { afterAuth: login });
  }, [login]);

  return (
    <Modal raw onClose={onClose}>
      <div id="virtru-auth-widget-mount"></div>
    </Modal>
  );
}

export default AuthSelect;
