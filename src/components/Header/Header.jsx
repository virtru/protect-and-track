import React from 'react';
import { connect } from 'redux-zero/react';

import { ReactComponent as LogoText } from '../../assets/logo-text.svg';

import './Header.css';
import GithubLogo from './github-logo.png';
import { ReactComponent as GithubIcon } from './github-icon.svg';
import { Button } from '../Button/Button';
import resetApp from '../../utils/resetApp';

const actions = {
  logout: async ({ oidcClient, userId }) => {
    console.log(`logging out ${userId}`);
    try {
      await Promise.all([oidcClient.logout(), resetApp()]);
    } catch (e) {
      console.warn(e);
    }
    return {
      authState: false,
      userId: false,
      virtruClient: false,
    };
  },
};

const AuthBlock = ({ authState, logout, setAuthOpen, userId }) => {
  if (userId) {
    return (
      <span className="currentUser">
        <span className="userID">{userId}</span>
        {'   '}
        <Button variant="link" onClick={logout} verySmall light>
          Reset &amp; Sign Out
        </Button>
      </span>
    );
  } else if (authState) {
    <>
      <Button variant="link" enabled="false" verySmall light>
        {authState}
      </Button>
      {'   '}
      <Button variant="link" onClick={logout} verySmall light>
        Reset
      </Button>
    </>;
  }
  return (
    <>
      <Button variant="link" onClick={() => setAuthOpen(true)} verySmall light>
        Sign In
      </Button>
      {'   '}
      <Button variant="link" onClick={logout} verySmall light>
        Reset
      </Button>
    </>
  );
};

/**
 * Header Component that displays content at the top of the page.
 */
const Header = ({ authState, logout, setAuthOpen, userId }) => {
  return (
    <div className="headerWrapper">
      <div className="headerContainer">
        <div className="headerLogo">
          <LogoText />
        </div>
        <div className="delimiter" />
        <span className="headerText">
          <span className="headerTitle">Protect &amp; Track Demo</span>
        </span>
        <div className="delimiter" />
        <button className="githubButton">
          <a
            href="https://github.com/virtru/protect-and-track"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
            <img alt="Virtru SDK Github" src={GithubLogo} />
          </a>
        </button>
        <span className="headerAuth">
          <AuthBlock
            authState={authState}
            logout={logout}
            setAuthOpen={setAuthOpen}
            userId={userId}
          />
        </span>
      </div>
    </div>
  );
};

const mapToProps = ({ authState, oidcClient, userId }) => ({ authState, oidcClient, userId });
export default connect(mapToProps, actions)(Header);
