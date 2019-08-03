import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import Toggle from '../Toggle/Toggle';
import { ReactComponent as ForwardIcon } from './forward.svg';
import classNames from 'classnames';
import './Resharing.css';

function Resharing({ policy, policyChange, isPolicyRevoked }) {
  const onChange = policyChange((builder, e) =>
    e.target.checked ? builder.disableReshare() : builder.enableReshare(),
  );
  const disabled = isPolicyRevoked;
  const checked = !disabled && policy && !policy.hasReshare();
  return (
    <div className={classNames('Resharing', { 'Section-disabled': disabled })}>
      <SectionHeader>
        <ForwardIcon />
        <h4>Disable Re-sharing</h4>
        <Toggle id="forward" checked={checked} disabled={disabled} onChange={onChange} />
      </SectionHeader>
    </div>
  );
}

export default Resharing;
