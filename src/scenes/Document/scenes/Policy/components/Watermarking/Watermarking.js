// MIT License
//
// Copyright (c) 2019 Virtru Corporation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import Toggle from '../Toggle/Toggle';
import { ReactComponent as WatermarkIcon } from './watermark.svg';
import classNames from 'classnames';
import './Watermarking.css';

function Watermarking({ file, policy, policyChange, isPolicyRevoked }) {
  /**** Virtru Block ****
   *
   * The following code shows how to enable and disable watermarking
   * https://developer.virtru.com/docs/how-to-add-virtru-controls
   *
   *****/

  // Virtru: get policy watermarking status
  const hasWatermarking = policy && policy.hasWatermarking();

  // Virtru: enable watermarking in policy
  const enableWatermarking = policy => policy.enableWatermarking();

  // Virtru: disable watermarking in policy
  const disableWatermarking = policy => policy.disableWatermarking();

  /**** END Virtru Block ****/

  const SUPPORTED_MEDIA = [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'application/pdf',
  ];
  const mediaType = file.file && file.file.type;
  const disabled = isPolicyRevoked || !SUPPORTED_MEDIA.includes(mediaType);

  const onChange = disabled
    ? undefined
    : policyChange((builder, e) =>
        e.target.checked ? enableWatermarking(builder) : disableWatermarking(builder),
      );
  const checked = disabled ? undefined : hasWatermarking;
  return (
    <div className={classNames('Watermarking', { 'Section-disabled': disabled })}>
      <SectionHeader>
        <WatermarkIcon />
        <h4>Watermarking</h4>
        <Toggle id="watermark" disabled={disabled} checked={checked} onChange={onChange} />
      </SectionHeader>
    </div>
  );
}

export default Watermarking;
