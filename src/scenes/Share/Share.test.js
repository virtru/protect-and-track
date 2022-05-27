import React from 'react';
import { cleanup, render, waitFor, fireEvent } from '@testing-library/react';
import { Share } from './Share';
import { SHARE_STATE, SHARE_PROVIDERS } from 'constants/sharing';
import * as gsuite from './services/gsuite';

jest.mock('./services/gsuite');

afterEach(cleanup);

describe('Share', () => {
  test('to gsuite', async () => {
    const setShare = jest.fn();
    const file = { name: 'a.tdf' };
    gsuite.init.mockReturnValue(true);
    const { getByText, rerender } = render(
      <Share encrypted={file} recipients={['a', 'b']} setShare={setShare} />,
    );
    expect(getByText('Share protected file')).toBeInTheDocument();
    await waitFor(() => expect(gsuite.init).toHaveBeenCalled());

    gsuite.upload.mockReturnValue({ result: { id: 'fake-id' } });
    fireEvent.click(getByText('Google Drive'));
    // Make sure we are sharing with the expected recipients
    await waitFor(() => expect(gsuite.share).toHaveBeenCalledWith('fake-id', ['a', 'b']));
    // Make sure we update the share state after
    const doneState = {
      state: SHARE_STATE.SHARED,
      id: 'fake-id',
      link: 'https://drive.google.com/open?id=fake-id',
      recipients: ['a', 'b'],
    };
    await waitFor(() =>
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
    await waitFor(() => expect(onClose).toHaveBeenCalled());
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
    await waitFor(() => expect(gsuite.init).toHaveBeenCalled());

    gsuite.signIn.mockImplementation(() => {
      throw new Error('popup_closed_by_user');
    });
    fireEvent.click(getByText('Google Drive'));

    await waitFor(() =>
      expect(setShare).toHaveBeenCalledWith({
        provider: SHARE_PROVIDERS.GOOGLEDRIVE,
        providerState: {
          state: SHARE_STATE.AUTHORIZING,
          recipients: ['a', 'b'],
        },
      }),
    );
    await waitFor(() =>
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
