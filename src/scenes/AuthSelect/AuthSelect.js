import React from 'react';
import { FormBox, FormBoxInstruction, FormBoxAlternative, FormBoxButton } from 'components/FormBox/FormBox';
import './AuthSelect.css';


function AuthButton(props) {
  return <button class="AuthSelect-button">
    <img alt='gmail-logo' src={`/${ props.type }.svg`} className='AuthSelect-ico' />
    <div className="AuthSelect-sep"></div>
    <span className='AuthSelect-title'>{ props.children }</span>
  </button>;
}

function AuthSelect(props) {
  return (
    <FormBox
        title="Virtru Drag &amp; Drop Demo Login"
        instruction="Select your Login Provider">
      <AuthButton type="gmail">
        Sign in with <span className='AuthSelect-red'>Google</span>
      </AuthButton>
      <AuthButton type="o365">
        Sign in with <span className='AuthSelect-blue'>Office 365</span>
      </AuthButton>
      <AuthButton type="outlook">
        Sign in with <span className='AuthSelect-blue'>Outlook</span>
      </AuthButton>

      <FormBoxAlternative>OR</FormBoxAlternative>

      <FormBoxInstruction>Let Virtru send you a code</FormBoxInstruction>
      <FormBoxButton id="sendcodebutton">Send Code to {props.userId}</FormBoxButton>
    </FormBox>
  );
}

export default AuthSelect;
