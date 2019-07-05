import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import Toggle from '../Toggle/Toggle';
import { ReactComponent as ForwardIcon } from './forward.svg';
import './Forwarding.css';

function Forwarding() {
  return (
    <div className="Forwarding">
      <SectionHeader>
        <ForwardIcon />
        <h4>Forwarding</h4>
        <Toggle id="forward" />
      </SectionHeader>
    </div>
  );
}

export default Forwarding;
