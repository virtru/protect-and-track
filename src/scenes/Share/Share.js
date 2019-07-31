import React, { useState, useEffect } from 'react';
import { connect } from 'redux-zero/react';
import Loading from './components/Loading/Loading';
import dropboxsuite from './services/dropboxsuite';
import gsuite from './services/gsuite';
import onedrive from './services/onedrive';
import './Share.css';
import { SHARE_STATE, SHARE_PROVIDERS, SHARE_TITLES } from 'constants/sharing';
import Button from 'components/Button/Button';
import Modal from 'components/Modal/Modal';

function Ico({ type }) {
  return <img alt="" src={`${type}.svg`} className="ShareSelect-ico" />;
}

function Title({ children }) {
  return <h3 className="Share-title">{children}</h3>;
}

function ShareContainer({ children }) {
  return <div className="Share-container">{children}</div>;
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
      setState(onClick ? 'enabled' : 'misconfigured');
    }
    initializeButtonBackend();
  }, [init, onClick]);

  return button;
}

function ShareSelect({ setShare, file, recipients, onClose }) {
  const shareToDropBox = async () => {
    try {
      const state = s =>
        setShare({
          provider: SHARE_PROVIDERS.DROPBOX,
          providerState: { state: s, recipients },
        });
      state(SHARE_STATE.AUTHORIZING);
      const accessToken = await dropboxsuite.signIn();
      state(SHARE_STATE.UPLOADING);
      const uploadResponse = await dropboxsuite.upload(accessToken, file);
      const link = 'https://www.dropbox.com/preview' + uploadResponse.path_lower;
      await dropboxsuite.share(accessToken, uploadResponse.id, recipients);
      setShare({
        provider: SHARE_PROVIDERS.DROPBOX,
        providerState: {
          state: SHARE_STATE.SHARED,
          id: uploadResponse.id,
          link,
          recipients,
        },
      });
    } catch (e) {
      console.log(e);
      // TODO(DSAT-67) enhance error messages
      setShare({
        provider: SHARE_PROVIDERS.DROPBOX,
        providerState: { state: SHARE_STATE.FAIL },
      });
    }
  };
  const shareToDrive = async () => {
    let link, id, state, errorMessage;
    const upstate = () =>
      setShare({
        provider: SHARE_PROVIDERS.GOOGLEDRIVE,
        providerState: {
          state,
          recipients,
          ...(id && { id }),
          ...(link && { link }),
          ...(errorMessage && { error: errorMessage }),
        },
      });
    try {
      state = SHARE_STATE.AUTHORIZING;
      upstate();
      // NOTE(DSAT-1) In Safari, this call must occur in a direct user action handler.
      // Safari's policy is that popups must be in response to a direct user action,
      // so no `await` calls can preceded this. To work around this, we load the API
      // before enabling the share button so this is the first gapi call.
      const user = await gsuite.signIn();
      if (user !== recipients[0]) {
        console.log('Sharing as a different user');
      }

      state = SHARE_STATE.UPLOADING;
      upstate();
      const uploadResponse = await gsuite.upload(file.name, file.payload);
      state = SHARE_STATE.SHARING;
      id = uploadResponse.result.id;
      link = 'https://drive.google.com/open?id=' + uploadResponse.result.id;
      upstate();
      await gsuite.share(id, recipients);
      // TODO(DSAT-67) Validate responses
      // TODO(DSAT-14) Store permissions and don't sign out.
      state = SHARE_STATE.SHARED;
      gsuite.signOut();
      upstate();
    } catch (e) {
      const { error } = e;
      if (error === 'popup_closed_by_user') {
        errorMessage = 'Authorization popup window closed or disabled';
      } else {
        console.log(JSON.stringify(e));
      }
      state = SHARE_STATE.FAIL;
      upstate();
    }
  };
  const shareToOnedrive = async () => {
    try {
      const state = s =>
        setShare({
          provider: SHARE_PROVIDERS.ONEDRIVE,
          providerState: { state: s, recipients },
        });
      state(SHARE_STATE.AUTHORIZING);
      const token = await onedrive.signIn();
      state(SHARE_STATE.SHARING);
      const uploadResponse = await onedrive.upload(token, file);
      // NOTE onedrive doesn't like sharing with yourself, so break this into two bits
      // The owner may sign into onedrive with another account, and they may share with
      // the onedrive owner explicitly, so maybe we should break this into one request per recipient.
      if (recipients.length > 1) {
        await onedrive.share(token, uploadResponse.id, recipients.slice(1));
      }
      await onedrive.share(token, uploadResponse.id, recipients.slice(0, 1));
      onedrive.signOut();
      setShare({
        provider: SHARE_PROVIDERS.ONEDRIVE,
        providerState: {
          state: SHARE_STATE.SHARED,
          id: uploadResponse.id,
          link: 'https://onedrive.live.com/?id=' + uploadResponse.id,
          recipients,
        },
      });
    } catch (e) {
      // TODO(DSAT-67) enhance error messages
      setShare({
        provider: SHARE_PROVIDERS.ONEDRIVE,
        providerState: { state: SHARE_STATE.FAIL },
      });
      console.log('1drive error: ' + JSON.stringify(e));
      throw e;
    }
  };
  return (
    <ShareContainer>
      <Title>Share {(file && file.name) || 'protected file'}</Title>
      <ShareButton type="googledrive" onClick={shareToDrive} init={gsuite.init}>
        Google Drive
      </ShareButton>
      <ShareButton type="onedrive" init={onedrive.init} onClick={shareToOnedrive}>
        OneDrive
      </ShareButton>
      <ShareButton type="dropbox" init={dropboxsuite.init} onClick={shareToDropBox}>
        Dropbox
      </ShareButton>
      <ShareButton type="box">Box</ShareButton>
    </ShareContainer>
  );
}

function RecipientList({ recipients }) {
  return (
    <ol>
      {recipients.map(user => {
        return (
          <li key={user} className="Share-recipient">
            {user}
          </li>
        );
      })}
    </ol>
  );
}

function Connecting({ provider }) {
  return (
    <ShareContainer>
      <Title>{'Connecting to ' + SHARE_TITLES[provider]}...</Title>
      <div className="Share-center">
        <Ico type={provider} /> <Loading />
      </div>
      <p>Connecting to {SHARE_TITLES[provider]} on your behalf</p>
    </ShareContainer>
  );
}

function Fail({ provider, providerState, setShare }) {
  const tryAgain = e => {
    e.preventDefault();
    setShare(false);
  };
  return (
    <ShareContainer>
      <Title>Couldn't share to {'  ' + SHARE_TITLES[provider]}</Title>
      <div className="Share-center">
        <Ico type={provider} /> <Ico type="danger" />
      </div>
      <p>Sorry, there was a problem sharing your file. Please try again.</p>
      {providerState.error && (
        <p className="Share-Fail-explain">
          <img alt="" src="danger-small.svg" className="ShareSelect-inline" /> {providerState.error}
        </p>
      )}
      <Button onClick={tryAgain} variant="alternateButton">
        Try Again
      </Button>
    </ShareContainer>
  );
}

function Uploading({ file, provider }) {
  const { file: { name } = {} } = file;
  return (
    <ShareContainer>
      <Title>Uploading{(name && ' ' + name) || ''}...</Title>
      <div className="Share-center">
        <Ico type={provider} /> <Loading />
      </div>
      <p>We're uploading your file to {'  ' + SHARE_TITLES[provider]}</p>
    </ShareContainer>
  );
}

function Sharing({ file, provider, recipients }) {
  const { file: { name } = {} } = file;
  return (
    <ShareContainer>
      <Title>Sharing{(name && ' ' + name) || ''}...</Title>
      <div className="Share-center">
        <Ico type={provider} /> <Loading />
      </div>
      <p>We're sharing your file with the following people:</p>
      <RecipientList recipients={recipients} />
    </ShareContainer>
  );
}

function ShareComplete({ provider, providerState, file, onClose, recipients }) {
  // console.log(`<ShareComplete provider=${JSON.stringify(provider)} providerState=${JSON.stringify(providerState)} file=${JSON.stringify(file)} onClose=${JSON.stringify(onclose)} recipients=${JSON.stringify(recipients)} />`);
  const { link } = providerState;
  const { file: { name } = {} } = file;
  const handleDoneClick = e => {
    e.preventDefault();
    onClose();
  };
  return (
    <ShareContainer>
      <Title>Shared {name || 'your file'}</Title>
      {provider && (
        <div className="Share-center">
          <Ico type={provider} /> <Ico type="done" />
        </div>
      )}
      <p>
        Ask these people to open{' '}
        <a href={link} target="_blank" rel="noopener noreferrer">
          your file
        </a>
        , and you should see a <b>Track Event</b>:
      </p>
      <RecipientList recipients={recipients} />
      <Button onClick={handleDoneClick} variant="alternateButton">
        Done
      </Button>
    </ShareContainer>
  );
}

function Share({ encrypted, onClose, providers, recipients, share, setShare }) {
  let shareContent;
  const closeAndResetState = (...args) => {
    onClose(...args);
    setShare(false);
  };
  if (!share) {
    shareContent = <ShareSelect setShare={setShare} file={encrypted} recipients={recipients} />;
  } else {
    const { state } = providers[share];
    switch (state) {
      case SHARE_STATE.UNSHARED:
        // This should not be
        break;
      case SHARE_STATE.AUTHORIZING:
        shareContent = <Connecting provider={share} />;
        break;
      case SHARE_STATE.UPLOADING:
        shareContent = <Uploading file={encrypted} provider={share} />;
        break;
      case SHARE_STATE.SHARING:
        shareContent = <Sharing file={encrypted} provider={share} recipients={recipients} />;
        break;
      case SHARE_STATE.SHARED:
        shareContent = (
          <ShareComplete
            file={encrypted}
            recipients={recipients}
            provider={share}
            providerState={providers[share]}
            onClose={closeAndResetState}
          />
        );
        break;
      case SHARE_STATE.FAIL:
        shareContent = (
          <Fail provider={share} providerState={providers[share]} setShare={setShare} />
        );
        break;
      default:
    }
  }

  return <Modal onClose={closeAndResetState}>{shareContent}</Modal>;
}

/* TODO(dmihalcik) maybe move this to a separate store?
share: {
  provider: null | ∈ {box dropbox googledrive onedrive},
}
share_${serviceProviderName}: {
  state: ∈ SHARE_STATE,
    link: url,
    id: per-service-id
  }
}
*/
const mapToProps = ({ encrypted, policy, share, ...rest }) => ({
  encrypted,
  recipients: policy.getUsers(),
  share,
  providers: (() => {
    let o = {};
    for (let k in SHARE_PROVIDERS) {
      const provider = SHARE_PROVIDERS[k];
      o[provider] = rest['share_' + provider];
    }
    return o;
  })(),
});

const actions = {
  setShare: (state, value) =>
    value
      ? {
          share: value.provider,
          ['share_' + value.provider]: value.providerState,
        }
      : { share: false },
};

export default connect(
  mapToProps,
  actions,
)(Share);
