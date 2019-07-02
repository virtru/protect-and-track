import React from 'react';
import './Sidebar.css';
import { Scrollbars } from 'react-custom-scrollbars';
import SidebarItem from './components/SidebarItem';

const { useEffect } = React;

const Sidebar = ({ collapse }) => {
  useEffect(() => {
    window.PR.prettyPrint();
  }, [window.PR.prettyPrint]);

  return (
    <div className="SidebarContainer">
      <div className="collapseContainer">
        <span onClick={collapse} className="collapse">
          x
        </span>
      </div>
      <div className="itemWrapper">
        <Scrollbars autoHide renderThumbVertical={() => <div className="custom_scroll" />}>
          <SidebarItem />
        </Scrollbars>
      </div>
    </div>
  );
};

export default Sidebar;
