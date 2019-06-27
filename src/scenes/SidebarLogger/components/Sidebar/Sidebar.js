import React from 'react';
import './Sidebar.css';
import { Scrollbars } from 'react-custom-scrollbars';
import SidebarItem from './components/SidebarItem';

export default ({collapse}) => (
  <div className="SidebarContainer">
    <div className='collapseContainer'>
      <span onClick={collapse} className="collapse">Hide</span>
    </div>
    <div className="itemWrapper">
      <Scrollbars autoHide>
        <SidebarItem />
      </Scrollbars>
    </div>
  </div>
)
