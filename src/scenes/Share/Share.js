import React from 'react';
import { FormBox } from 'components/FormBox/FormBox';
import Loading from './components/Loading/Loading';
import { init as initGapi, upload as uploadToDrive } from './services/gsuite';
import './Share.css';
import Store from 'store.js';


function Ico({ type }) {
  return <img alt="" src={`/${ type }.svg`} className='ShareSelect-ico' />
}

function ShareButton({ children, onClick, type }) {
  const action = onClick || false;
  const handleClick = e => {
    e.preventDefault();
    action && action(e);
  };

  return (
    <button className="ShareSelect-button" onClick={handleClick} disabled={!action}>
      <Ico type={type} />
      <span className='ShareSelect-title'>{ children }</span>
    </button>
  );
}

function ShareSelect() {
  let store = Store.useStore();
  const shareToDrive = async () => {
    const state = s => store.set('share')({state: s, host: 'googledrive'});
    const api = await initGapi();
    state('authorizing');
    const authResponse = await api.auth2.getAuthInstance().signIn();
    console.log('await');
    console.log(authResponse);
    state('sharing');
    const uploadResponse = await uploadToDrive('helloworld.txt', 'text/plain', 'Hello World!');
    console.log(uploadResponse);
    // store.set('share')('cleaning');
    const signOutResponse = api.auth2.getAuthInstance().signOut();
    console.log(signOutResponse);
    state('shared');
  };
  return (
    <FormBox instruction="Share protected file">
      <ShareButton type="googledrive" onClick={shareToDrive}>Google Drive</ShareButton>
      <ShareButton type="onedrive">OneDrive</ShareButton>
      <ShareButton type="dropbox">Dropbox</ShareButton>
      <ShareButton type="box">Box</ShareButton>
    </FormBox>
  );
}

function RecipientList() {
  return (
    <ol>
      <li>burt.with.the.long.name@domain.example.invalid</li>
      <li>sally@elsewhere.com</li>
    </ol>
  );
}

function Sharing() {
  return (
    <FormBox instruction="Sharing...">
      <Loading />
      <p>We're sharing your file with the following people:</p>
      <RecipientList />
    </FormBox>
  );
}

function TrackItButton() {
  return <button>Track it!</button>;
}

function ShareComplete() {
  const { host } = Store.useStore().get('share');
  return (
    <FormBox instruction="Share protected file">
      {host && <Ico type={host} />}
      <p>
        Ask these people to open your file,
        and you should see a <b>Track Event</b>:
      </p>
      <RecipientList />
      <TrackItButton />
    </FormBox>
  );
}

function Share() {
  let store = Store.useStore();
  const share = store.get('share');
  switch (share.state) {
    case 'unshared': return <ShareSelect />;
    case 'authorizing':
    case 'sharing': return <Sharing />;
    case 'shared': return <ShareComplete />;
    default: return <p>{share}</p>;
  }
}

export default Share;
