import React from 'react';
import { render, wait, fireEvent, getByTestId, act } from '@testing-library/react';
import Document from './Document';
import * as tdf from 'utils/tdfWrapper';
import * as services from 'services/audit';
jest.mock('utils/tdfWrapper');
jest.mock('services/audit');

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

  test('should trigger loginAs on auth form submit, that will call tdf.authenticate and will update userId and virtru client', async () => {
    const client = { userId: 'foo' };
    const updateVirtruClient = jest.fn();
    const updateUserId = jest.fn();
    tdf.authenticate.mockImplementation(() => Promise.resolve(client));
    const file = { file: { name: 'foo.txt' } };

    const { container, getByText } = render(
      <Document file={file} updateVirtruClient={updateVirtruClient} updateUserId={updateUserId} />,
    );
    fireEvent.click(getByText('Sign in to continue'));

    fireEvent.change(getByTestId(container, 'emailAuthInput'), {
      target: { value: 'foo@bar.com' },
    });
    fireEvent.submit(getByTestId(container, 'formAuth'));

    act(() => {
      // still throws warning. Should be fixed in later react and react testing lib versions
      // https://github.com/testing-library/react-testing-library/issues/281#issuecomment-507910126
      fireEvent.click(getByTestId(container, 'emailAuthButton'));
    });

    await wait(() => {
      expect(updateVirtruClient).toHaveBeenCalledWith(client);
      expect(updateUserId).toHaveBeenCalledWith('foo@bar.com');
    });
  });

  test('should encrypt file, trigger updateEncrypted and set 2sec interval audit update', async () => {
    jest.useFakeTimers();
    const timeout = 2000;
    const triggerTimes = 5;
    const file = { file: { name: 'foo.txt' }, data: 'biteArr' };
    const client = 'clientVirttu';
    const spy = jest.fn(() =>
      Promise.resolve({ encryptedFile: 'encFile', policyId: 'foo1bar', type: 'someType' }),
    );
    const updateEncrypted = jest.fn();
    const updateAuditEvents = jest.fn();
    tdf.encrypt.mockImplementation(spy);
    tdf.encrypt.mockImplementation(spy);
    services.getAuditEvents.mockImplementation(() =>
      Promise.resolve({ json: () => Promise.resolve({ data: 'someData' }) }),
    );

    const { container } = render(
      <Document
        file={file}
        virtruClient={client}
        userId="foo@bar.com"
        updateEncrypted={updateEncrypted}
        updateAuditEvents={updateAuditEvents}
      />,
    );
    act(() => {
      fireEvent.click(getByTestId(container, 'encryptFile'));
    });

    await wait(() => {
      expect(spy).toHaveBeenCalledWith({
        client,
        fileData: file.data,
        filename: file.file.name,
        userEmail: 'foo@bar.com',
        asHtml: true,
      });
    });
    expect(updateEncrypted).toHaveBeenCalledWith({
      payload: 'encFile',
      name: `${file.file.name}.html`,
      type: file.file.type,
    });
    expect(updateAuditEvents).toHaveBeenCalledTimes(0);
    act(() => {
      jest.runTimersToTime(timeout * triggerTimes);
    });
    await wait(() => {
      expect(updateAuditEvents).toHaveBeenCalledTimes(triggerTimes);
    });
  });
});