import React from 'react';
import { SectionHeader } from '../SectionHeader/SectionHeader';
import Toggle from '../Toggle/Toggle';
import { ReactComponent as ForwardIcon } from './forward.svg';
import classNames from 'classnames';
import './Resharing.css';

function Resharing({ policy, policyChange, isPolicyRevoked }) {
  /**** Virtru Block ****
   *
   * The following code shows how to enable and disable resharing
   * https://developer.virtru.com/docs/how-to-add-virtru-controls
   *
   *****/

  // Virtru: Get policy reshare status
  const hasReshare = policy && !policy.hasReshare();

  // Virtu: Disable reshare
  const disableReshare = (policy) => policy.disableReshare();

  // Virtu: Enable reshare
  const enableReshare = (policy) => policy.enableReshare();

  /**** END Virtru Block ****/

  const onChange = policyChange((builder, e) =>
    e.target.checked ? disableReshare(builder) : enableReshare(builder),
  );
  const disabled = isPolicyRevoked;
  const checked = !disabled && hasReshare;
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
