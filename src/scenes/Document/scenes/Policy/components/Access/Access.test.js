import React from 'react';
import Virtru from 'utils/sdk';
import { generatePolicyChanger } from '../../services/policyChanger';
import { cleanup, fireEvent, render } from '@testing-library/react';

import { ENCRYPT_STATES } from '../../../../../constants/encryptStates';
import Access from './Access';

afterEach(cleanup);

describe('Access', () => {
  test('Renders an empty policy', () => {
    const { getByRole, getByText } = render(
      <Access
        encryptState={ENCRYPT_STATES.UNPROTECTED}
        policyChange={() => {}}
        policy={new Virtru.PolicyBuilder().build()}
      />,
    );
    // We should have just one form to grant a new user access
    expect(getByRole('textbox')).toBeTruthy();
    // We should just get the 'who has access' list
    expect(getByRole('heading')).toBeTruthy();
    // We should have the owner be 'you'
    expect(getByText('you')).toBeTruthy();
  });

  test('Renders an empty policy with a signed in user', () => {
    const { getByRole, getByText, queryAllByText } = render(
      <Access
        encryptState={ENCRYPT_STATES.UNPROTECTED}
        policy={new Virtru.PolicyBuilder().build()}
        policyChange={() => {}}
        userId="user@example.com"
      />,
    );
    expect(getByRole('textbox')).toBeTruthy();
    expect(getByRole('heading')).toBeTruthy();
    expect(getByText('user@example.com')).toBeTruthy();
    expect(queryAllByText('you')).toHaveLength(0);
  });

  test('Renders an simple policy with a signed in user', () => {
    const { getByText } = render(
      <Access
        encryptState={ENCRYPT_STATES.PROTECTED}
        policy={new Virtru.PolicyBuilder().addUsersWithAccess('a@abc.xyz', 'b@abc.xyz').build()}
        policyChange={() => {}}
        userId="a@abc.xyz"
      />,
    );
    // We should just get the grant button
    expect(getByText('Revoke')).toBeTruthy();
    expect(getByText('Grant')).toBeTruthy();
    expect(getByText('a@abc.xyz')).toBeTruthy();
    expect(getByText('b@abc.xyz')).toBeTruthy();
  });

  test('Adds a new user', () => {
    const setPolicy = jest.fn();
    const policy = new Virtru.PolicyBuilder().build();
    const policyChange = (change) => generatePolicyChanger(policy, setPolicy, change);
    const { getByRole } = render(<Access policy={policy} policyChange={policyChange} />);

    const textField = getByRole('textbox');
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
