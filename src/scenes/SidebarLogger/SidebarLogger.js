import React from 'react';
import './SidebarLogger.css';

import ShowSidebar from './components/ShowSidebar/ShowSidebar';
import Sidebar from './components/Sidebar/Sidebar';
import useIsPortrait from '../../commonHooks/useIsPortrait';

const { useState } = React;

export default () => {
  const [isOpen, setIsOpen] = useState(false);
  const isPortrait = useIsPortrait();

  const contentToRender = isOpen ? (
    <Sidebar collapse={() => setIsOpen(false)} />
  ) : (
    <ShowSidebar show={() => setIsOpen(true)} />
  );
  return !isPortrait && contentToRender;
};
