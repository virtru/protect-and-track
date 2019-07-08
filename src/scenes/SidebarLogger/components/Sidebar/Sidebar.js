import React from 'react';
import './Sidebar.css';
import { Scrollbars } from 'react-custom-scrollbars';
import SidebarItem from './components/SidebarItem';

const { useEffect, useRef } = React;

const Sidebar = ({ collapse, events }) => {
  const scroll = useRef();
  useEffect(() => {
    window.PR.prettyPrint();
    // On log update should scroll to last one
    const scrollHeight = scroll.current.getScrollHeight();
    scroll.current.scrollTop(scrollHeight);
  }, [window.PR.prettyPrint, events]);

  return (
    <div className="SidebarContainer" data-testid="sidebarBody">
      <div className="collapseContainer">
        <span onClick={collapse} className="collapse" data-testid="sidebarCloseButton">
          x
        </span>
      </div>
      <div className="itemWrapper" data-testid="sidebarScrollbars">
        <Scrollbars
          ref={scroll}
          autoHide
          renderThumbVertical={() => <div className="custom_scroll" />}
        >
          {events.map((event, i) => (
            <SidebarItem {...event} key={i} />
          ))}
        </Scrollbars>
      </div>
    </div>
  );
};

export default Sidebar;
