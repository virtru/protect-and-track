import React from 'react';
import './Sidebar.css';
import { Scrollbars } from 'react-custom-scrollbars';
import SidebarItem from './components/SidebarItem';

const { useEffect } = React;

export default ({ collapse }) => {
  useEffect(() => {
    window.PR.prettyPrint();
  });

  return (
    <div className="SidebarContainer">
      <div className="collapseContainer">
        <span onClick={collapse} className="collapse">
          Hide
        </span>
      </div>
      <div className="itemWrapper">
        <Scrollbars autoHide>
          <SidebarItem />
        </Scrollbars>
      </div>
    </div>
  );
};
