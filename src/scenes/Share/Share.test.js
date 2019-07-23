import React from 'react';
import { cleanup, render, wait, fireEvent, getByTestId, act } from '@testing-library/react';
import Share from './Share';
import gsuite from './services/gsuite';

jest.mock('./services/gsuite');

afterEach(cleanup);

describe('Share', () => {
  test('to gsuite', async () => {
    const updateShare = jest.fn();
    const unshared = { state: 'unshared', host: false };
    const file = { name: 'a.tdf' };
    const { getByText } = render(
      <Share encrypted={file} recipients={['a', 'b']} share={unshared} updateShare={updateShare} />,
    );
    expect(getByText('Share a.tdf')).toBeInTheDocument();
    await wait(() => expect(gsuite.init).toHaveBeenCalled());

    gsuite.upload.mockReturnValue({ result: { id: 'fake-id' } });
    fireEvent.click(getByText('Google Drive'));
    // Make sure we are sharing with the expected recipients
    await wait(() => expect(gsuite.share).toHaveBeenCalledWith('fake-id', ['a', 'b']));
    // Make sure we update the share state after
    await wait(() =>
      expect(updateShare).toHaveBeenCalledWith({
        state: 'shared',
        host: 'googledrive',
        link: 'https://drive.google.com/open?id=fake-id',
      }),
    );
  });
});
