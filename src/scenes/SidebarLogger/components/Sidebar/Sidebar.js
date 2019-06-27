import React from 'react';
import './Sidebar.css';
import { Scrollbars } from 'react-custom-scrollbars';

export default ({collapse}) => (
  <div className="SidebarContainer">
    <div className='collapseContainer'>
      <span onClick={collapse} className="collapse">Hide</span>
    </div>
    <div className="itemWrapper">
      <Scrollbars>

      </Scrollbars>
    </div>
  </div>
)
