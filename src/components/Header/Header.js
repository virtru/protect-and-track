
import React from 'react';

import { ReactComponent as LogoText } from 'assets/logo-text.svg';

import './Header.css';

/**
 * Header Component that displays content at the top of the page.
 */
const Header = () => (
  <div className='headerContainer'>
    <div className='headerLogo'>
      <LogoText />
    </div>
    <div className='delimiter' />
    <span className='headerText'>
      <span className='headerTitle'>Demo: Protect & Track</span>
    </span>
  </div>
);

export default Header;
