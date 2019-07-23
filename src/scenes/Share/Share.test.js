import React from 'react';
import { cleanup, render, wait, fireEvent, getByTestId, act } from '@testing-library/react';
import Share from './Share';
import { SHARING } from 'constants/api';
import gsuite from './services/gsuite';

jest.mock('./services/gsuite');

afterEach(cleanup);

describe('Share', () => {
  test('to gsuite', async () => {
    const updateShare = jest.fn();
    const file = { name: 'a.tdf' };
    const { getByText, rerender } = render(
      <Share encrypted={file} recipients={['a', 'b']} updateShare={updateShare} />,
    );
    expect(getByText('Share a.tdf')).toBeInTheDocument();
    await wait(() => expect(gsuite.init).toHaveBeenCalled());

    gsuite.upload.mockReturnValue({ result: { id: 'fake-id' } });
    fireEvent.click(getByText('Google Drive'));
    // Make sure we are sharing with the expected recipients
    await wait(() => expect(gsuite.share).toHaveBeenCalledWith('fake-id', ['a', 'b']));
    // Make sure we update the share state after
    const doneState = {
      state: 'shared',
      id: 'fake-id',
      link: 'https://drive.google.com/open?id=fake-id',
      recipients: ['a', 'b'],
    };
    await wait(() =>
      expect(updateShare).toHaveBeenCalledWith({
        provider: 'googledrive',
        providerState: doneState,
      }),
    );
    const onClose = jest.fn();
    rerender(
      <Share
        share="googledrive"
        encrypted={file}
        recipients={['a', 'b']}
        providers={{ googledrive: doneState }}
        updateShare={updateShare}
        onClose={onClose}
      />,
    );
    fireEvent.click(getByText('Done'));
    await wait(() => expect(onClose).toHaveBeenCalled());
  });
});
