import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import Toggle from '../Toggle/Toggle';
import { generatePolicyChanger } from '../../services/policyChanger';
import { ReactComponent as WatermarkIcon } from './watermark.svg';

function Watermarking({ policy, updatePolicy }) {
  const policyChange = change => generatePolicyChanger(policy, updatePolicy, change);
  const onChange = policyChange((builder, e) =>
    e.target.checked ? builder.disableWatermarking() : builder.enableWatermarking(),
  );
  return (
    <div className="Watermarking">
      <SectionHeader>
        <WatermarkIcon />
        <h4>Watermarking</h4>
        <Toggle id="watermark" checked={policy && !policy.hasWatermarking()} onChange={onChange} />
      </SectionHeader>
    </div>
  );
}

export default Watermarking;
