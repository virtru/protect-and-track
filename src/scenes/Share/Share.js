import React, { useState, useEffect } from 'react';
import { connect } from 'redux-zero/react';
import Loading from './components/Loading/Loading';
import * as dropboxsuite from './services/dropboxsuite';
import * as gsuite from './services/gsuite';
import * as onedrive from './services/onedrive';
import './Share.css';
import { SHARE_STATE, SHARE_PROVIDERS, SHARE_TITLES } from 'constants/sharing';
import Button from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';

function Ico({ type }) {
  return <img alt="" src={`${type}.svg`} className="ShareSelect-ico" />;
}

function Title({ children }) {
  return <h1>{children}</h1>;
}

function ShareContainer({ children }) {
  return <div className="Share-container">{children}</div>;
}

function ShareButton({ children, init, onClick, type }) {
  const [buttonState, setButtonState] = useState('start');
  const handleClick = (e) => {
    e.preventDefault();
    onClick && onClick(e);
  };

  const button = (
    <button
      className="ShareSelect-button"
      onClick={handleClick}
      disabled={buttonState !== 'enabled'}
    >
      <Ico type={type} />
      <div className="ShareSelect-button-text">{children}</div>
    </button>
  );

  useEffect(() => {
    if (!init) {
      return;
    }
    async function initializeButtonBackend() {
      const backendSuccess = onClick && (await init());
      setButtonState(backendSuccess ? 'enabled' : 'misconfigured');
    }
    initializeButtonBackend();
  }, [init, onClick]);

  return button;
}

function ShareSelect({ setShare, file, recipients, fileName }) {
  const shareToDropBox = async () => {
    let link, id, state, error;
    const upstate = () =>
      setShare({
        provider: SHARE_PROVIDERS.DROPBOX,
        providerState: {
          state,
          recipients,
          ...(id && { id }),
          ...(link && { link }),
          ...(error && { error }),
        },
      });
    try {
      state = SHARE_STATE.AUTHORIZING;
      upstate();
      const accessToken = await dropboxsuite.signIn();

      state = SHARE_STATE.UPLOADING;
      upstate();
      const uploadResponse = await dropboxsuite.upload(accessToken, file);
      id = uploadResponse.id;
      link = 'https://www.dropbox.com/preview' + uploadResponse.path_lower;

      state = SHARE_STATE.SHARING;
      upstate();
      await dropboxsuite.share(accessToken, uploadResponse.id, recipients);

      state = SHARE_STATE.SHARED;
      upstate();

      dropboxsuite.signOut();
    } catch (e) {
      console.warn({ type: 'Drive share failure', cause: e });
      error = {
        during: state,
      };
      // TODO(DSAT-67) enhance error messages
      if (e.status === 409) {
        error.message = `${fileName} already exists in your Dropbox.`;
      } else if (e.status === 403) {
        error.message =
          'Dropbox is rate limiting access to this application or user; please build the app locally and add your own app token';
      }
      state = SHARE_STATE.FAIL;
      upstate();
    }
  };
  const shareToDrive = async () => {
    let link, id, state, error;
    const upstate = () =>
      setShare({
        provider: SHARE_PROVIDERS.GOOGLEDRIVE,
        providerState: {
          state,
          recipients,
          ...(id && { id }),
          ...(link && { link }),
          ...(error && { error }),
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
      link = `https://drive.google.com/open?id=${id}`;
      upstate();
      await gsuite.share(id, recipients);
      // TODO(DSAT-67) Validate responses
      // TODO(DSAT-14) Store permissions and don't sign out.

      state = SHARE_STATE.SHARED;
      upstate();
      gsuite.signOut();
    } catch (e) {
      console.info({ type: 'google drive error', cause: e });
      error = {
        during: state,
      };
      if (e.errors) {
        // error during batch
        if (e.errors.code === 403) {
          error.message =
            'Google Drive is rate limiting access to this application, resource, or user; please build the app locally and add your own app token';
        }
      } else if (e.error === 'popup_closed_by_user') {
        error.message = 'Authorization popup window closed or disabled';
      } else if (e.code === 403) {
        error.message =
          'Google Drive is rate limiting access to this application or user; please build the app locally and add your own app token';
      } else {
        console.warn({ type: 'Drive share failure', cause: e });
      }
      state = SHARE_STATE.FAIL;
      upstate();
    }
  };
  const shareToOnedrive = async () => {
    let link, id, state, error;
    const upstate = () =>
      setShare({
        provider: SHARE_PROVIDERS.ONEDRIVE,
        providerState: {
          state,
          recipients,
          ...(id && { id }),
          ...(link && { link }),
          ...(error && { error }),
        },
      });
    try {
      state = SHARE_STATE.AUTHORIZING;
      upstate();
      const token = await onedrive.signIn();

      state = SHARE_STATE.UPLOADING;
      upstate();
      const uploadResponse = await onedrive.upload(token, file);

      state = SHARE_STATE.SHARING;
      id = uploadResponse.id;
      link = 'https://onedrive.live.com/?id=' + uploadResponse.id;
      upstate();
      recipients.map(async (user) => {
        try {
          await onedrive.share(token, uploadResponse.id, [user]);
        } catch (e) {
          if (e.error && e.error.message === 'Owner cannot be added as a member') {
            // NOTE onedrive doesn't like sharing with yourself, so break this into two bits
            // The owner may sign into onedrive with another account, and they may share with
            // the onedrive owner explicitly, so maybe we should break this into one request per recipient.
          } else {
            throw e;
          }
        }
      });

      state = SHARE_STATE.SHARED;
      upstate();
      onedrive.signOut();
    } catch (e) {
      console.info({ type: '1drive error', cause: e });
      error = {
        during: state,
      };
      state = SHARE_STATE.FAIL;
      upstate();
    }
  };
  return (
    <ShareContainer>
      <Title>Share protected file</Title>
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
      {recipients.map((user) => {
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
  const tryAgain = (e) => {
    e.preventDefault();
    setShare(false);
  };
  const verbs = {
    [SHARE_STATE.AUTHORIZING]: 'authorize the user with',
    [SHARE_STATE.UPLOADING]: 'upload to',
    [SHARE_STATE.SHARING]: 'share to',
    [SHARE_STATE.SHARED]: 'disconnect from',
  };
  const { error, link } = providerState;
  const uploaded =
    error &&
    error.during &&
    providerState.link &&
    (error.during === SHARE_STATE.SHARING || error.during === SHARE_STATE.SHARED);
  const verb = verbs[error && error.during] || 'share with';
  return (
    <ShareContainer>
      <Title>Couldn't {verb + '  ' + SHARE_TITLES[provider]}</Title>
      <div className="Share-center">
        <Ico type={provider} /> <Ico type="danger" />
      </div>
      {uploaded ? (
        <p>
          We were unable to invite your recipients to view your file. You may continue to view{' '}
          <a href={link} target="_blank" rel="noopener noreferrer">
            your file
          </a>
          .
        </p>
      ) : (
        <p>Try 'Download' on the demo page to share via email or other means.</p>
      )}

      {error && error.message && (
        <p className="Share-Fail-explain">
          <img alt="" src="danger-small.svg" className="ShareSelect-inline" /> {error.message}
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
  const { link } = providerState;
  const { file: { name } = {} } = file;
  const handleDoneClick = (e) => {
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

function ShareInternal({ encrypted, onClose, providers, recipients, share, setShare }) {
  let shareContent;
  const closeAndResetState = (...args) => {
    onClose(...args);
    setShare(false);
  };
  if (!share) {
    shareContent = (
      <ShareSelect
        setShare={setShare}
        file={encrypted}
        recipients={recipients}
        fileName={encrypted.name}
      />
    );
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
          <Fail
            provider={share}
            providerState={providers[share]}
            setShare={setShare}
            fileName={encrypted.name}
          />
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
  recipients: policy.getUsersWithAccess(),
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

export const Share = connect(mapToProps, actions)(ShareInternal);
