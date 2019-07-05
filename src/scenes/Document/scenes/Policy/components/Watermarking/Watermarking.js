import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import Toggle from '../Toggle/Toggle';
import { ReactComponent as WatermarkIcon } from './watermark.svg';
import './Watermarking.css';

function Watermarking() {
  return (
    <div className="Watermarking">
      <SectionHeader>
        <WatermarkIcon />
        <h4>Watermarking</h4>
        <Toggle id="watermark" />
      </SectionHeader>
    </div>
  );
}

export default Watermarking;
