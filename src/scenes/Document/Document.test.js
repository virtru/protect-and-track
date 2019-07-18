import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import Document from './Document';
import { ENCRYPT_STATES } from './scenes/Policy/Policy';
import * as tdf from 'utils/tdfWrapper';
jest.mock('utils/tdfWrapper');

describe('Document', () => {
  test('should trigger auth and and updates Virtru Client on every update, if userId defined but there is no virtruClient Document ', async () => {
    const client = { userId: 'foo' };
    const spy = jest.fn();
    tdf.authenticate.mockImplementation(() => Promise.resolve(client));

    const { rerender } = render(<Document updateVirtruClient={spy} />);
    expect(spy).not.toHaveBeenCalled();

    rerender(<Document userId="foo@bar.com" updateVirtruClient={spy} />);
    await wait(() => expect(spy).toHaveBeenCalledWith(client));
  });

  test('should show dropzone if no file passed and document details if file defined', () => {
    const { rerender, getByText } = render(<Document />);
    expect(getByText('Choose File')).toBeInTheDocument();

    const file = { file: { name: 'foo.txt' } };
    rerender(<Document file={file} />);
    expect(getByText('foo.txt')).toBeInTheDocument();
  });

  test('should open auth select modal', () => {
    const file = { file: { name: 'foo.txt' } };
    const { getByText } = render(<Document file={file} />);
    fireEvent.click(getByText('Sign in to continue'));
    expect(getByText('Enter your email address:')).toBeInTheDocument();
  });
});
