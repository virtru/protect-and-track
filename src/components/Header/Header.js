import React from 'react';

import { ReactComponent as LogoText } from 'assets/logo-text.svg';

import './Header.css';
import GithubLogo from './github-logo.png';
import { ReactComponent as GithubIcon } from './github-icon.svg';
import Button from '../Button/Button';
import Virtru from 'utils/VirtruWrapper';

/**
 * Header Component that displays content at the top of the page.
 */
const Header = ({ userId }) => {
  function renderAuth() {
    if (userId) {
      return (
        <span>
          {userId}{' '}
          <Button variant="link" onClick={() => Virtru.signOut(userId)} verySmall light>
            Sign out
          </Button>
        </span>
      );
    }
  }
  return (
    <div className="headerContainer">
      <div className="headerLogo">
        <LogoText />
      </div>
      <div className="delimiter" />
      <span className="headerText">
        <span className="headerTitle">Protect & Track Demo</span>
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
  );
};

export default Header;
