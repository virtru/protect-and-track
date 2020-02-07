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
  const disableReshare = policy => policy.disableReshare();

  // Virtu: Enable reshare
  const enableReshare = policy => policy.enableReshare();

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
