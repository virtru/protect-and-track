import React from 'react';
import Virtru from 'virtru-tdf3-js';
import { cleanup, fireEvent, render } from '@testing-library/react';

import ENCRYPT_STATES from 'constants/encryptStates';
import Access from './Access';

afterEach(cleanup);

describe('Access', () => {
  test('Renders an empty policy', () => {
    const { getByRole, getByText } = render(
      <Access
        encryptState={ENCRYPT_STATES.UNPROTECTED}
        policy={new Virtru.Client.PolicyBuilder().build()}
      />,
    );
    // We should have just one form to grant a new user access
    expect(getByRole('form')).toBeTruthy();
    // We should just get the 'who has access' list
    expect(getByRole('heading')).toBeTruthy();
    // We should have the owner be 'you'
    expect(getByText('you')).toBeTruthy();
  });

  test('Renders an empty policy with a signed in user', () => {
    const { getByRole, getByText, queryAllByText } = render(
      <Access
        encryptState={ENCRYPT_STATES.UNPROTECTED}
        policy={new Virtru.Client.PolicyBuilder().build()}
        userId="user@example.com"
      />,
    );
    expect(getByRole('form')).toBeTruthy();
    expect(getByRole('heading')).toBeTruthy();
    expect(getByText('user@example.com')).toBeTruthy();
    expect(queryAllByText('you')).toHaveLength(0);
  });

  test('Renders an simple policy with a signed in user', () => {
    const { getByText } = render(
      <Access
        encryptState={ENCRYPT_STATES.PROTECTED}
        policy={new Virtru.Client.PolicyBuilder().addUsers('a@abc.xyz', 'b@abc.xyz').build()}
        userId="a@abc.xyz"
      />,
    );
    // We should just get the grant button
    expect(getByText('Revoke All')).toBeTruthy();
    expect(getByText('Revoke')).toBeTruthy();
    expect(getByText('Grant')).toBeTruthy();
    expect(getByText('a@abc.xyz')).toBeTruthy();
    expect(getByText('b@abc.xyz')).toBeTruthy();
  });

  test('Adds a new user', () => {
    const setPolicy = jest.fn();
    const { getByRole } = render(
      <Access policy={new Virtru.Client.PolicyBuilder().build()} setPolicy={setPolicy} />,
    );

    const textForm = getByRole('form');
    const textField = textForm.querySelector('input[type="email"]');
    fireEvent.change(textField, { target: { value: 'recipient@example.com' } });
    fireEvent.submit(textField);

    expect(setPolicy).toBeCalledWith(
      expect.objectContaining({
        _users: expect.objectContaining({
          'recipient@example.com': true,
        }),
      }),
    );
  });
});
