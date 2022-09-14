import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Share from './Share';
import { SHARE_STATE, SHARE_PROVIDERS } from 'constants/sharing';
import * as gsuite from './services/gsuite';

jest.mock('./services/gsuite');

afterEach(cleanup);

describe('Share', () => {
  test('to gsuite', async () => {
    const user = userEvent.setup();
    const setShare = jest.fn();
    const file = { name: 'a.tdf' };
    gsuite.init.mockReturnValue(true);
    expect(gsuite.init).toHaveBeenCalledTimes(0);
    const { rerender } = render(
      <Share encrypted={file} recipients={['a', 'b']} setShare={setShare} />,
    );
    expect(screen.getByText('Share protected file')).toBeInTheDocument();
    await waitFor(() => expect(gsuite.init).toHaveBeenCalled());

    gsuite.upload.mockReturnValue({ result: { id: 'fake-id' } });
    await user.click(screen.getByText('Google Drive'));
    // Make sure we are sharing with the expected recipients
    await waitFor(() => {
      expect(gsuite.upload).toHaveBeenCalledTimes(1);
      expect(gsuite.share).toHaveBeenCalledWith('fake-id', ['a', 'b']);
    });
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
    await user.click(screen.getByText('Done'));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  test('to gsuite fail auth', async () => {
    const user = userEvent.setup();
    const setShare = jest.fn();
    const file = { name: 'a.tdf' };
    gsuite.init.mockReturnValue(true);
    expect(gsuite.init).toHaveBeenCalledTimes(0);
    render(<Share encrypted={file} recipients={['a', 'b']} setShare={setShare} />);
    expect(screen.getByText('Share protected file')).toBeInTheDocument();
    await waitFor(() => expect(gsuite.init).toHaveBeenCalled());

    gsuite.upload.mockImplementation(() => {
      throw new Error('upload_fail');
    });
    await user.click(screen.getByText('Google Drive'));
    await Promise.all([
      waitFor(() =>
        expect(setShare).toHaveBeenCalledWith({
          provider: SHARE_PROVIDERS.GOOGLEDRIVE,
          providerState: {
            state: SHARE_STATE.AUTHORIZING,
            recipients: ['a', 'b'],
          },
        }),
      ),
      expect(setShare).toHaveBeenCalledWith({
        provider: SHARE_PROVIDERS.GOOGLEDRIVE,
        providerState: {
          state: SHARE_STATE.FAIL,
          error: {
            during: SHARE_STATE.UPLOADING,
          },
          recipients: ['a', 'b'],
        },
      }),
    ]);
  });
});
