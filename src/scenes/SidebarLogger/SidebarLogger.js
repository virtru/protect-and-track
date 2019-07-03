import React from 'react';
import { connect } from 'redux-zero/react';
import './SidebarLogger.css';

import ShowSidebar from './components/ShowSidebar/ShowSidebar';
import Sidebar from './components/Sidebar/Sidebar';
import useIsPortrait from '../../commonHooks/useIsPortrait';

const { useState } = React;

const SidebarLogger = ({tdfLog}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isPortrait = useIsPortrait();

  const contentToRender = isOpen ? (
    <Sidebar events={tdfLog} collapse={() => setIsOpen(false)} />
  ) : (
    <ShowSidebar show={() => setIsOpen(true)} />
  );
  return !isPortrait && contentToRender;
};

const mapToProps = ({ tdfLog }) => ({ tdfLog });
export default connect(
  mapToProps
)(SidebarLogger);
