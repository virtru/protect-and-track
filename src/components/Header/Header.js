// MIT License
//
// Copyright (c) 2019 Virtru Corporation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
        <span className="currentUser">
          <span className="userID">{userId}</span>{' '}
          <Button variant="link" onClick={() => Virtru.signOut(userId)} verySmall light>
            Reset & Sign Out
          </Button>
        </span>
      );
    }
    return (
      <Button variant="link" onClick={() => Virtru.signOut()} verySmall light>
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
    </div>
  );
};

export default Header;
