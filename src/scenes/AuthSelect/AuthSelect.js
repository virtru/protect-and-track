import React from 'react';
import { FormBox, FormBoxInstruction, FormBoxAlternative, FormBoxButton } from '../../components/FormBox/FormBox';
import './AuthSelect.css';


function AuthSelect(props) {
  return (
    <FormBox
        title="Virtru Drag &amp; Drop Demo Login"
        instruction="Select your Login Provider">
      <input type="button" id="googlebutton" className="login-button-google" />
      <input type="button" id="office365button" className="login-button-office365" />
      <input type="button" id="outlookbutton" className="login-button-outlook" />

      <FormBoxAlternative>OR</FormBoxAlternative>

      <FormBoxInstruction>Let Virtru send you a code</FormBoxInstruction>
      <FormBoxButton id="sendcodebutton">Send Code to {props.userId}</FormBoxButton>
    </FormBox>
  );
}

export default AuthSelect;
