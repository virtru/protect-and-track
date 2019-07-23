import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import Toggle from '../Toggle/Toggle';
import { generatePolicyChanger } from '../../services/policyChanger';
import { ReactComponent as WatermarkIcon } from './watermark.svg';

function Watermarking({ policy, setPolicy }) {
  const policyChange = change => generatePolicyChanger(policy, setPolicy, change);
  const onChange = policyChange((builder, e) =>
    e.target.checked ? builder.enableWatermarking() : builder.disableWatermarking(),
  );
  return (
    <div className="Watermarking">
      <SectionHeader>
        <WatermarkIcon />
        <h4>Watermarking</h4>
        <Toggle id="watermark" checked={policy && policy.hasWatermarking()} onChange={onChange} />
      </SectionHeader>
    </div>
  );
}

export default Watermarking;
