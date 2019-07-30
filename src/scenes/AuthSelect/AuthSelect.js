import React, { useState } from 'react';
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
  const [authStep, setAuthStep] = useState(AUTH_STEPS.ENTER_EMAIL);
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');

  const validateAndContinue = () => {
    if (validateEmail(email)) {
      return setAuthStep(authStep + 1);
    }

    alert('Invalid email address');
  };

  // TODO - Email auth
  // const beginEmailAuth = async () => {
  //   await Virtru.sendEmailCode(email)
  //   setAuthStep(AUTH_STEPS.ENTER_CODE);
  // };

  const renderContent = () => {
    if (authStep === AUTH_STEPS.ENTER_EMAIL) {
      return (
        <form onSubmit={validateAndContinue} data-testid="formAuth">
          <h3 className="auth-title">Enter your email address:</h3>
          <input
            required
            className="Email-input"
            type="email"
            data-testid="emailAuthInput"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button type="submit">Continue</Button>
        </form>
      );
    } else if (authStep === AUTH_STEPS.CHOOSE_PROVIDER) {
      return (
        <>
          <h3 className="auth-title">Select your auth provider:</h3>
          <input
            type="button"
            id="googlebutton"
            value=""
            className="login-button login-button-google"
            data-testid="emailAuthButton"
            onClick={() => login({ userEmail: email, authMethod: 'google' })}
          />
          <input
            type="button"
            id="office365button"
            className="login-button login-button-office365"
            onClick={() => login({ userEmail: email, authMethod: 'o365' })}
          />
          <input
            type="button"
            id="outlookbutton"
            className="login-button  login-button-outlook"
            onClick={() => login({ userEmail: email, authMethod: 'outlook' })}
          />
          {/* <h3 className="auth-title">Or let Virtru send you a code</h3>
          <Button onClick={beginEmailAuth} >Send Code to {email}</Button> */}
        </>
      );
    } else if (authStep === AUTH_STEPS.ENTER_CODE) {
      return (
        <form data-testid="formAuth">
          <h3 className="auth-title">
            Enter the code sent to <br /> {email}:
          </h3>
          <input
            required
            className="Email-input"
            type="text"
            data-testid="emailAuthInput"
            value={authCode}
            onChange={e => setAuthCode(e.target.value)}
            onSubmit={() => {}}
          />
          <Button type="submit" disabled={authCode.length !== 6}>
            Continue
          </Button>
        </form>
      );
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="Auth-container">{renderContent()}</div>
    </Modal>
  );
}

export default AuthSelect;
