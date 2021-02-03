import React from 'react';

import { ReactComponent as LogoText } from 'assets/logo-text.svg';

import Virtru from 'utils/sdk';
import './Header.css';
import GithubLogo from './github-logo.png';
import { ReactComponent as GithubIcon } from './github-icon.svg';
import Button from '../Button/Button';
import resetApp from 'utils/resetApp';

const signOut = email => Promise.all(Virtru.Auth.logout(email && { email }), resetApp());

/**
 * Header Component that displays content at the top of the page.
 */
const Header = ({ userId }) => {
  function renderAuth() {
    if (userId) {
      return (
        <span className="currentUser">
          <span className="userID">{userId}</span>{' '}
          <Button variant="link" onClick={e => signOut(userId)} verySmall light>
            Reset &amp; Sign Out
          </Button>
        </span>
      );
    }
    return (
      <Button variant="link" onClick={e => signOut()} verySmall light>
        Reset
      </Button>
    );
  }
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
        <span className="headerAuth">{renderAuth()}</span>
      </div>
    </div>
  );
};

export default Header;
