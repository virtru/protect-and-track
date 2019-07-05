import React from 'react';
import './ShowSidebar.css';

export default ({ show }) => (
  <div className="ShowSidebarButton" data-testid="sidebarButton" onClick={show}>
    <svg
      className="ShowSidebarIcon"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7z" />
      <path fill="none" d="M0 0h24v24H0z" />
    </svg>
  </div>
);
