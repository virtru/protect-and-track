import React from 'react';
import { cleanup, render, wait, fireEvent, getByTestId, act } from '@testing-library/react';
import Document from './Document';
import ENCRYPT_STATES from 'constants/encryptStates';
import Virtru from 'utils/VirtruWrapper';
import VirtruClient from 'virtru-sdk';
import * as services from 'services/audit';
jest.mock('utils/VirtruWrapper');
jest.mock('services/audit');

afterEach(cleanup);

describe('Document', () => {
  test('should trigger auth and and updates Virtru Client on every update, if userId defined but there is no virtruClient Document ', async () => {
    const client = { userId: 'foo' };
    const spy = jest.fn();
    Virtru.authenticate.mockImplementation(() => Promise.resolve(client));

    const { rerender } = render(<Document setVirtruClient={spy} setEncryptState={() => {}} />);
    expect(spy).not.toHaveBeenCalled();

    rerender(<Document userId="foo@bar.com" setVirtruClient={spy} setEncryptState={() => {}} />);
    await wait(() => expect(spy).toHaveBeenCalledWith(client));
  });

  test('should show dropzone if no file passed and document details if file defined', () => {
    const { rerender, getByText } = render(<Document setEncryptState={() => {}} />);
    expect(getByText('Choose File')).toBeInTheDocument();

    const file = { file: { name: 'foo.txt' } };
    const policy = new VirtruClient.Client.PolicyBuilder().build();
    rerender(<Document file={file} policy={policy} setEncryptState={() => {}} />);
    expect(getByText('foo.txt')).toBeInTheDocument();
  });

  test('should open auth select modal', () => {
    const file = { file: { name: 'foo.txt' } };
    const policy = new VirtruClient.Client.PolicyBuilder().build();
    const { getByText } = render(
      <Document file={file} policy={policy} setEncryptState={() => {}} />,
    );
    fireEvent.click(getByText('Sign in to continue'));
    expect(getByText('Enter your email address:')).toBeInTheDocument();
  });

  test('should trigger login on auth form submit, that will call Virtru.authenticate and will update userId and virtru client', async () => {
    const client = { userId: 'foo' };
    const setVirtruClient = jest.fn();
    const setUserId = jest.fn();
    Virtru.authenticate.mockImplementation(() => Promise.resolve(client));
    const file = { file: { name: 'foo.txt' } };
    const policy = new VirtruClient.Client.PolicyBuilder().build();

    const { container, getByText } = render(
      <Document
        file={file}
        policy={policy}
        setVirtruClient={setVirtruClient}
        setEncryptState={() => {}}
        setUserId={setUserId}
      />,
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
      expect(setVirtruClient).toHaveBeenCalledWith(client);
      expect(setUserId).toHaveBeenCalledWith('foo@bar.com');
    });
  });

  test('should encrypt file, trigger setEncrypted and set 2sec interval audit update', async () => {
    jest.useFakeTimers();
    const timeout = 2000;
    const triggerTimes = 5;
    const file = { file: { name: 'foo.txt' }, arrayBuffer: 'arrayBuffer' };
    const policy = new VirtruClient.Client.PolicyBuilder().build();
    const client = 'clientVirttu';
    const spy = jest.fn(() =>
      Promise.resolve({ encryptedFile: 'encFile', policyId: 'foo1bar', type: 'someType' }),
    );
    const setEncrypted = jest.fn();
    const setAuditEvents = jest.fn();
    Virtru.encrypt.mockImplementation(spy);
    services.getAuditEvents.mockImplementation(() =>
      Promise.resolve({ json: () => Promise.resolve({ data: 'someData' }) }),
    );

    const { container, rerender } = render(
      <Document
        auditEvents={[]}
        encryptState={ENCRYPT_STATES.UNPROTECTED}
        file={file}
        policy={policy}
        virtruClient={client}
        userId="foo@bar.com"
        setEncrypted={setEncrypted}
        setEncryptState={() => {}}
        setAuditEvents={setAuditEvents}
      />,
    );
    act(() => {
      fireEvent.click(getByTestId(container, 'encryptFile'));
    });

    await wait(() => {
      expect(spy).toHaveBeenCalledWith({
        client,
        fileData: file.arrayBuffer,
        filename: file.file.name,
        policy,
        userEmail: 'foo@bar.com',
        asHtml: true,
      });
    });
    const expectedEncrypted = {
      payload: 'encFile',
      name: `${file.file.name}.html`,
      type: file.file.type,
    };
    expect(setEncrypted).toHaveBeenCalledWith(expectedEncrypted);
    expect(setAuditEvents).toHaveBeenCalledTimes(0);

    rerender(
      <Document
        auditEvents={[]}
        encrypted={expectedEncrypted}
        encryptState={ENCRYPT_STATES.PROTECTED}
        file={file}
        policy={policy}
        userId="foo@bar.com"
        virtruClient={client}
        setAuditEvents={setAuditEvents}
        setEncrypted={setEncrypted}
        setEncryptState={() => {}}
      />,
    );

    for (let i = 1; i <= 5; i++) {
      jest.runOnlyPendingTimers();
      await wait(() => {
        expect(setAuditEvents).toHaveBeenCalledTimes(i);
      });
    }
    rerender(
      <Document
        auditEvents={[]}
        encryptState={ENCRYPT_STATES.UNPROTECTED}
        file={file}
        policy={policy}
        userId="foo@bar.com"
        virtruClient={client}
        setAuditEvents={setAuditEvents}
        setEncrypted={setEncrypted}
        setEncryptState={() => {}}
      />,
    );
    jest.runOnlyPendingTimers();
    await wait(() => {
      expect(setAuditEvents).toHaveBeenCalledTimes(5);
    });
  });
});
