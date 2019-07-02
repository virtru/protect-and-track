import React, { useState } from 'react';
import Loading from './components/Loading/Loading';
import { init as initGapi, upload as uploadToDrive } from './services/gsuite';
import './Share.css';
import Store from 'store.js';

/* global gapi */

function Ico({ type }) {
  return <img alt="" src={`/${type}.svg`} className="ShareSelect-ico" />;
}

function Title({ children }) {
  return <h3 className="Share-title">{children}</h3>;
}

function ShareBox({ children }) {
  return <div className="Share-box">{children}</div>;
}

function ShareButton({ children, init, onClick, type }) {
  const [state, setState] = useState('start');
  const handleClick = e => {
    e.preventDefault();
    onClick && onClick(e);
  };

  const button = (
    <button className="ShareSelect-button" onClick={handleClick} disabled={state !== 'enabled'}>
      <Ico type={type} />
      <div className="ShareSelect-button-text">{children}</div>
    </button>
  );

  init &&
    init().then(() => {
      console.log('init complete');
      setState(onClick ? 'enabled' : 'misconfigured');
    });

  return button;
}

function ShareSelect() {
  const store = Store.useStore();
  const shareToDrive = async () => {
    try {
      const file = store.get('file');
      const state = s => store.set('share')({ state: s, host: 'googledrive' });
      state('authorizing');
      // NOTE(DSAT-1) In Safari, this call must occur in a direct user action handler.
      // Safari's policy is that popups must be in response to a direct user action,
      // so no `await` calls can preceded this. To work around this, we load the API
      // before enabling the share button so this is the first gapi call.
      const authResponse = await gapi.auth2.getAuthInstance().signIn();
      console.log(authResponse);
      state('sharing');
      const uploadResponse = await uploadToDrive(file.file.name, file.file.type, file.arrayBuffer);
      console.log(uploadResponse);
      // TODO(DSAT-14) Store permissions and don't sign out.
      const signOutResponse = gapi.auth2.getAuthInstance().signOut();
      console.log(signOutResponse);
      store.set('share')({
        state: 'shared',
        host: 'googledrive',
        link: 'https://drive.google.com/open?id=' + uploadResponse.result.id,
      });
    } catch (e) {
      console.log(JSON.stringify(e));
      throw e;
    }
  };
  const { file } = store.get('file');
  return (
    <ShareBox>
      <Title>Share {(file && file.name) || 'protected file'}</Title>
      <ShareButton type="googledrive" onClick={shareToDrive} init={initGapi}>
        Google Drive
      </ShareButton>
      <ShareButton type="onedrive">OneDrive</ShareButton>
      <ShareButton type="dropbox">Dropbox</ShareButton>
      <ShareButton type="box">Box</ShareButton>
    </ShareBox>
  );
}

function RecipientList() {
  return (
    <ol>
      <li className="Share-recipient">burt.with.the.long.name@domain.example.invalid</li>
      <li className="Share-recipient">sally@elsewhere.com</li>
    </ol>
  );
}

function Sharing() {
  const { file: { name } = {} } = Store.useStore().get('file');
  return (
    <ShareBox>
      <Title>Sharing{(name && ' ' + name) || ''}...</Title>
      <div className="Share-center">
        <Loading />
      </div>
      <p>We're sharing your file with the following people:</p>
      <RecipientList />
    </ShareBox>
  );
}

function TrackItButton() {
  const handleClick = e => {
    e.preventDefault();
  };
  return (
    <button onClick={handleClick} className="Share-trackit">
      Track it!
    </button>
  );
}

function ShareComplete() {
  const { host, link } = Store.useStore().get('share');
  const { file: { name } = {} } = Store.useStore().get('file');
  return (
    <ShareBox>
      <Title>Track {name || 'your shared file'}</Title>
      {host && (
        <div className="Share-center">
          <Ico type={host} />
        </div>
      )}
      <p>
        Ask these people to open <a href={link}>your file</a>, and you should see a{' '}
        <b>Track Event</b>:
      </p>
      <RecipientList />
      <TrackItButton />
    </ShareBox>
  );
}

function Share() {
  let store = Store.useStore();
  const share = store.get('share');
  switch (share.state) {
    case 'unshared':
      return <ShareSelect />;
    case 'authorizing':
    case 'sharing':
      return <Sharing />;
    case 'shared':
      return <ShareComplete />;
    default:
      return <p>{share}</p>;
  }
}

export default Share;
