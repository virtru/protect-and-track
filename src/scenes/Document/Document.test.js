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
import { cleanup, render, wait, fireEvent, getByTestId, act } from '@testing-library/react';
import Document from './Document';
import ENCRYPT_STATES from 'constants/encryptStates';
import Virtru from 'virtru-sdk';

afterEach(cleanup);

Virtru.AuthWidget = jest.fn();

describe('Document', () => {
  test.skip('should trigger auth and and updates Virtru Client on every update, if userId defined but there is no virtruClient Document ', async () => {
    const client = { userId: 'foo' };
    const spy = jest.fn();

    const { rerender } = render(<Document setVirtruClient={spy} setEncryptState={() => {}} />);
    expect(spy).not.toHaveBeenCalled();

    rerender(<Document userId="foo@bar.com" setVirtruClient={spy} setEncryptState={() => {}} />);
    await wait(() => expect(spy).toHaveBeenCalledWith(client));
  });

  test('should show dropzone if no file passed and document details if file defined', () => {
    const { rerender, getByText } = render(<Document setEncryptState={() => {}} />);
    expect(getByText('Choose File')).toBeInTheDocument();

    const file = { file: { name: 'foo.txt' } };
    const policy = new Virtru.PolicyBuilder().build();
    rerender(<Document file={file} policy={policy} setEncryptState={() => {}} />);
    expect(getByText('foo.txt')).toBeInTheDocument();
  });

  test.skip('should open auth select modal', () => {
    const file = { file: { name: 'foo.txt' } };
    const policy = new Virtru.PolicyBuilder().build();
    const { getByText } = render(
      <Document file={file} policy={policy} setEncryptState={() => {}} />,
    );
    fireEvent.click(getByText('Sign In to Protect'));
    expect(getByText('Enter your email address:')).toBeInTheDocument();
  });

  test.skip('should encrypt file, trigger setEncrypted and set 2sec interval audit update', async () => {
    jest.useFakeTimers();
    const file = { file: { name: 'foo.txt' }, arrayBuffer: 'arrayBuffer' };
    const policy = new Virtru.PolicyBuilder().build();
    const client = 'clientVirttu';
    const spy = jest.fn(() =>
      Promise.resolve({ encryptedFile: 'encFile', policyId: 'foo1bar', type: 'someType' }),
    );
    const setEncrypted = jest.fn();
    const setAuditEvents = jest.fn();
    Virtru.encrypt.mockImplementation(spy);

    const { container, rerender } = render(
      <Document
        setPolicyId={() => {}}
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
        setPolicyId={() => {}}
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
        setPolicyId={() => {}}
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
