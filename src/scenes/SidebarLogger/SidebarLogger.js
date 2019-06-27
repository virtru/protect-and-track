import React from 'react';
import './SidebarLogger.css';

import ShowSidebar from './components/ShowSidebar/ShowSidebar';
import Sidebar from './components/Sidebar/Sidebar';

const { useState } = React;

export default () => {
  const [isOpen, setIsOpen] = useState(true);

  return(
    isOpen
    ? <Sidebar />
    : <ShowSidebar collapse={() => (setIsOpen(true))} />
  );
}
