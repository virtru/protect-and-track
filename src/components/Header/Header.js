import React from 'react';

import { ReactComponent as LogoText } from 'assets/logo-text.svg';

import './Header.css';
import GithubLogo from './github-logo.png';
import { ReactComponent as GithubIcon } from './github-icon.svg';

/**
 * Header Component that displays content at the top of the page.
 */
const Header = ({ loginUrl }) => (
  <div className="headerContainer">
    <div className="headerLogo">
      <LogoText />
    </div>
    <div className="delimiter" />
    <span className="headerText">
      <span className="headerTitle">Demo: Protect & Track</span>
    </span>
    <div className="delimiter" />
    <button className="githubButton">
      <a href="https://github.com/virtru/virtru-tdf3-js" target="_blank" rel="noopener noreferrer">
        <GithubIcon />
        <img alt="Virtru SDK Github" src={GithubLogo} />
      </a>
    </button>
    <a href={loginUrl} className="sign-in">
      Sign In
    </a>
  </div>
);

export default Header;
