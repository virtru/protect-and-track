import React, { useState, useEffect } from 'react';
import { connect } from 'redux-zero/react';
import Loading from './components/Loading/Loading';
import gsuite from './services/gsuite';
import './Share.css';
import Button from '../../components/Button/Button';

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

function ShareSelect({ updateShare, file, onClose }) {
  const shareToDrive = async () => {
    try {
      const state = s => updateShare({ state: s, host: 'googledrive' });
      state('authorizing');
      // NOTE(DSAT-1) In Safari, this call must occur in a direct user action handler.
      // Safari's policy is that popups must be in response to a direct user action,
      // so no `await` calls can preceded this. To work around this, we load the API
      // before enabling the share button so this is the first gapi call.
      await gsuite.signIn();

      state('sharing');
      const uploadResponse = await gsuite.upload(file.name, file.type, file.payload);

      // TODO(DSAT-14) Store permissions and don't sign out.
      gsuite.signOut();
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
      <button className="Share-close" onClick={onClose} title="Close Share Modal">
        X
      </button>
      <Title>Share {(file && file.name) || 'protected file'}</Title>
      <ShareButton type="googledrive" onClick={shareToDrive} init={gsuite.init}>
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
  return <Button onClick={handleClick}>Share</Button>;
}

function ShareComplete({ share, file, onClose }) {
  const { host, link } = share;
  const { file: { name } = {} } = file;
  return (
    <ShareBox>
      <button className="Share-close" onClick={onClose} title="Close Share Modal">
        X
      </button>
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

function Share({ share, encrypted, updateShare, onClose }) {
  let shareContent;
  switch (share.state) {
    case 'unshared':
      shareContent = <ShareSelect updateShare={updateShare} file={encrypted} onClose={onClose} />;
      break;
    case 'authorizing':
    case 'sharing':
      shareContent = <Sharing file={encrypted} />;
      break;
    case 'shared':
      shareContent = <ShareComplete share={share} file={encrypted} onClose={onClose} />;
      break;
    default:
  }

  return <div className="Share-wrapper">{shareContent}</div>;
}

const mapToProps = ({ share, encrypted }) => ({ share, encrypted });

const actions = {
  updateShare: (state, value) => ({ share: value }),
};

export default connect(
  mapToProps,
  actions,
)(Share);
