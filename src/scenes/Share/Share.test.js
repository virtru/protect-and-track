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
import { cleanup, render, wait, fireEvent } from '@testing-library/react';
import Share from './Share';
import { SHARE_STATE, SHARE_PROVIDERS } from 'constants/sharing';
import gsuite from './services/gsuite';

jest.mock('./services/gsuite');

afterEach(cleanup);

describe('Share', () => {
  test('to gsuite', async () => {
    const setShare = jest.fn();
    const file = { name: 'a.tdf', payload: {} };
    const policy = {
      getPolicyId: () => {},
      getUsersWithAccess: () => [],
      getExpirationDeadline: () => '',
      hasReshare: () => '',
      hasWatermarking: () => '',
    };
    gsuite.init.mockReturnValue(true);
    const { getByText, rerender } = render(
      <Share encrypted={file} recipients={['a', 'b']} setShare={setShare} policy={policy} />,
    );
    expect(getByText('Share protected file')).toBeInTheDocument();
    await wait(() => expect(gsuite.init).toHaveBeenCalled());

    gsuite.upload.mockReturnValue({ result: { id: 'fake-id' } });
    fireEvent.click(getByText('Google Drive'));
    // Make sure we are sharing with the expected recipients
    await wait(() => expect(gsuite.share).toHaveBeenCalledWith('fake-id', ['a', 'b']));
    // Make sure we update the share state after
    const doneState = {
      state: SHARE_STATE.SHARED,
      id: 'fake-id',
      link: 'https://drive.google.com/open?id=fake-id',
      recipients: ['a', 'b'],
    };
    await wait(() =>
      expect(setShare).toHaveBeenCalledWith({
        provider: SHARE_PROVIDERS.GOOGLEDRIVE,
        providerState: doneState,
      }),
    );
    const onClose = jest.fn();
    rerender(
      <Share
        share={SHARE_PROVIDERS.GOOGLEDRIVE}
        encrypted={file}
        recipients={['a', 'b']}
        providers={{ googledrive: doneState }}
        setShare={setShare}
        onClose={onClose}
      />,
    );
    fireEvent.click(getByText('Done'));
    await wait(() => expect(onClose).toHaveBeenCalled());
  });

  test('to gsuite fail auth', async () => {
    const setShare = jest.fn();
    const file = { name: 'a.tdf', payload: {} };
    const policy = {
      getPolicyId: () => {},
      getUsersWithAccess: () => [],
      getExpirationDeadline: () => '',
      hasReshare: () => '',
      hasWatermarking: () => '',
    };
    const { getByText } = render(
      <Share encrypted={file} recipients={['a', 'b']} setShare={setShare} policy={policy} />,
    );
    expect(getByText('Share protected file')).toBeInTheDocument();
    await wait(() => expect(gsuite.init).toHaveBeenCalled());

    gsuite.signIn.mockImplementation(() => {
      throw { error: 'popup_closed_by_user' };
    });
    fireEvent.click(getByText('Google Drive'));

    await wait(() =>
      expect(setShare).toHaveBeenCalledWith({
        provider: SHARE_PROVIDERS.GOOGLEDRIVE,
        providerState: {
          state: SHARE_STATE.AUTHORIZING,
          recipients: ['a', 'b'],
        },
      }),
    );
    await wait(() =>
      expect(setShare).toHaveBeenCalledWith({
        provider: SHARE_PROVIDERS.GOOGLEDRIVE,
        providerState: {
          state: SHARE_STATE.FAIL,
          error: {
            during: SHARE_STATE.AUTHORIZING,
            message: 'Authorization popup window closed or disabled',
          },
          recipients: ['a', 'b'],
        },
      }),
    );
  });
});
