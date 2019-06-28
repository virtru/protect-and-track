import React from 'react';
import Loading from './components/Loading/Loading';
import { init as initGapi, upload as uploadToDrive } from './services/gsuite';
import './Share.css';
import Store from 'store.js';

function Ico({ type }) {
  return <img alt="" src={`/${type}.svg`} className="ShareSelect-ico" />;
}

function Title({ children }) {
  return <h3 className="Share-title">{children}</h3>;
}

function ShareBox({ children }) {
  return <div className="Share-box">{children}</div>;
}

function ShareButton({ children, onClick, type }) {
  const handleClick = e => {
    e.preventDefault();
    onClick && onClick(e);
  };

  return (
    <button className="ShareSelect-button" onClick={handleClick} disabled={!onClick}>
      <Ico type={type} />
      <div className="ShareSelect-button-text">{children}</div>
    </button>
  );
}

function ShareSelect() {
  const store = Store.useStore();
  const shareToDrive = async () => {
    const file = store.get('file');
    const state = s => store.set('share')({ state: s, host: 'googledrive' });
    const api = await initGapi();
    state('authorizing');
    const authResponse = await api.auth2.getAuthInstance().signIn();
    console.log(authResponse);
    state('sharing');
    const uploadResponse = await uploadToDrive(file.file.name, file.file.type, file.arrayBuffer);
    console.log(uploadResponse);
    // TODO(DSAT-14) Store permissions and don't sign out.
    const signOutResponse = api.auth2.getAuthInstance().signOut();
    console.log(signOutResponse);
    store.set('share')({
      state: 'shared',
      host: 'googledrive',
      link: 'https://drive.google.com/open?id=' + uploadResponse.result.id,
    });
  };
  const { file } = store.get('file');
  return (
    <ShareBox>
      <Title>Share {(file && file.name) || 'protected file'}</Title>
      <ShareButton type="googledrive" onClick={shareToDrive}>
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
