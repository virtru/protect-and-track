import React from 'react';
import './Sidebar.css';
import { Scrollbars } from 'react-custom-scrollbars';
import SidebarItem from './components/SidebarItem';

const { useEffect } = React;

const Sidebar = ({ collapse, events }) => {
  useEffect(() => {
    window.PR.prettyPrint();
  }, [window.PR.prettyPrint, events]);

  return (
    <div className="SidebarContainer">
      <div className="collapseContainer">
        <span onClick={collapse} className="collapse">
          x
        </span>
      </div>
      <div className="itemWrapper">
        <Scrollbars>
          {
            events.map((event, i) => <SidebarItem {...event} key={i} />)
          }
        </Scrollbars>
      </div>
    </div>
  );
};

export default Sidebar;
