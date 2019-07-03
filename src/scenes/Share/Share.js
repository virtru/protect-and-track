import React, { useState, useEffect } from 'react';
import { connect } from 'redux-zero/react';
import Loading from './components/Loading/Loading';
import { init as initGapi, upload as uploadToDrive } from './services/gsuite';
import './Share.css';
import actions from './actions';

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

  useEffect(() => {
    if (!init) {
      return;
    }
    async function initializeButtonBackend() {
      await init();
      console.log('init complete');
      setState(onClick ? 'enabled' : 'misconfigured');
    }
    initializeButtonBackend();
  }, [init, onClick]);

  return button;
}

function ShareSelect({ updateShare, file }) {
  const shareToDrive = async () => {
    try {
      const state = s => updateShare({ state: s, host: 'googledrive' });
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
      updateShare({
        state: 'shared',
        host: 'googledrive',
        link: 'https://drive.google.com/open?id=' + uploadResponse.result.id,
      });
    } catch (e) {
      console.log(JSON.stringify(e));
      throw e;
    }
  };
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

function Sharing({ file }) {
  const { file: { name } = {} } = file;
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

function ShareComplete({ share, file }) {
  const { host, link } = share;
  const { file: { name } = {} } = file;
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

function Share({ share, file, updateShare }) {
  switch (share.state) {
    case 'unshared':
      return <ShareSelect updateShare={updateShare} file={file} />;
    case 'authorizing':
    case 'sharing':
      return <Sharing file={file} />;
    case 'shared':
      return <ShareComplete host={share.host} file={file} />;
    default:
      return <p>{share}</p>;
  }
}

const mapToProps = ({ share, file }) => ({ share, file });

export default connect(
  mapToProps,
  actions,
)(Share);
