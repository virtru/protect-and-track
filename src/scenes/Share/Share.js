import React from 'react';
import { FormBox, FormBoxInstruction, FormBoxAlternative } from 'components/FormBox/FormBox';
import './Share.css';


function ShareButton(props) {
  return <button className="ShareSelect-button">
    <img alt={`${ props.type } logo`} src={`/${ props.type }.svg`} className='ShareSelect-ico' />
    <span className='ShareSelect-title'>{ props.children }</span>
  </button>;
}

function ShareSelect(props) {
  return (
    <FormBox instruction="Share protected file">
      <ShareButton type="googledrive">Google Drive</ShareButton>
      <ShareButton type="onedrive">OneDrive</ShareButton>
      <ShareButton type="dropbox">Dropbox</ShareButton>
      <ShareButton type="box">Box</ShareButton>
    </FormBox>
  );
}

export default ShareSelect;
