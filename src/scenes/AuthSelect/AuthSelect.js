import React, { useState } from 'react';
import './AuthSelect.css';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';

const AUTH_STEPS = {
  ENTER_EMAIL: 0,
  CHOOSE_PROVIDER: 1,
};

function validateEmail(email) {
  // eslint-disable-next-line no-useless-escape
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function AuthSelect({ onClose, loginAs }) {
  const [authStep, setAuthStep] = useState(AUTH_STEPS.ENTER_EMAIL);
  const [email, setEmail] = useState();

  const validateAndContinue = () => {
    if (validateEmail(email)) {
      return setAuthStep(authStep + 1);
    }

    alert('Invalid email address');
  };

  const renderContent = () => {
    if (authStep === AUTH_STEPS.ENTER_EMAIL) {
      return (
        <form onSubmit={validateAndContinue}>
          <h3>Enter your email address:</h3>
          <input
            required
            className="Email-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button type="submit">Continue</Button>
        </form>
      );
    }

    return (
      <>
        <h3>Select your auth provider:</h3>
        <input
          type="button"
          id="googlebutton"
          value=""
          className="login-button-google"
          onClick={() => loginAs(email)}
        />
        <input disabled type="button" id="office365button" className="login-button-office365" />
        <input disabled type="button" id="outlookbutton" className="login-button-outlook" />
      </>
      /* <FormBoxAlternative>OR</FormBoxAlternative>

      <FormBoxInstruction>Let Virtru send you a code</FormBoxInstruction>
      <FormBoxButton id="sendcodebutton">Send Code to {userId}</FormBoxButton> */
    );
  };

  return (
    <Modal onClose={onClose}>
      <div className="Auth-container">{renderContent()}</div>
    </Modal>
  );
}

export default AuthSelect;
