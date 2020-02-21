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
import Virtru from 'utils/sdk';
import { generatePolicyChanger } from '../../services/policyChanger';
import { cleanup, fireEvent, render } from '@testing-library/react';

import Expiration from './Expiration';

afterEach(cleanup);

describe('Expiration', () => {
  test('Renders a toggled off expiration', () => {
    const { container, queryByRole } = render(
      <Expiration policy={new Virtru.PolicyBuilder().build()} policyChange={() => {}} />,
    );
    expect(container.querySelector('input[type=checkbox]').checked).toBeFalsy();
    expect(queryByRole('textinput')).toBeFalsy();
  });

  test('Custom', () => {
    const setPolicy = jest.fn();
    const policy = new Virtru.PolicyBuilder().build();
    const policyChange = change => generatePolicyChanger(policy, setPolicy, change);
    const now = new Date();
    let later = new Date(now);
    later.setMinutes(now.getMinutes() + 5, 0, 0);
    const { container } = render(
      <Expiration policy={policy} policyChange={policyChange} now={now} />,
    );

    const checkbox = container.querySelector('input[type=checkbox]');
    fireEvent.click(checkbox);

    expect(setPolicy).toBeCalledWith(
      expect.objectContaining({
        _deadline: later.toISOString(),
      }),
    );
  });
});
