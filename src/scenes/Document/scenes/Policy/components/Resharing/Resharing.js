import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import Toggle from '../Toggle/Toggle';
import { ReactComponent as ForwardIcon } from './forward.svg';
import './Resharing.css';

function Resharing({ policy, policyChange }) {
  const onChange = policyChange((builder, e) =>
    e.target.checked ? builder.disableReshare() : builder.enableReshare(),
  );
  return (
    <div className="Resharing">
      <SectionHeader>
        <ForwardIcon />
        <h4>Disable Re-sharing</h4>
        <Toggle id="forward" checked={policy && !policy.hasReshare()} onChange={onChange} />
      </SectionHeader>
    </div>
  );
}

export default Resharing;
