import React from 'react';
import './SdkLogger.css';
import { Scrollbars } from 'rc-scrollbars';
import { SidebarItem } from './components/SidebarItem';

const { useEffect, useRef } = React;

const SdkLogger = ({ events }) => {
  const scroll = useRef();
  useEffect(() => {
    if (!window.PR) {
      return;
    }
    window.PR.prettyPrint();
    // On log update should scroll to last one
    const scrollHeight = scroll.current.getScrollHeight();
    scroll.current.scrollTop(scrollHeight);
  }, [events]);

  return (
    <div className="LoggerContainer" data-testid="SdkLogger">
      <div className="itemWrapper">
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

export default SdkLogger;
