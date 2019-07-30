import React from 'react';
import Virtru from 'virtru-tdf3-js';
import { generatePolicyChanger } from '../../services/policyChanger';
import { cleanup, fireEvent, render } from '@testing-library/react';

import Expiration from './Expiration';

afterEach(cleanup);

describe('Expiration', () => {
  test('Renders a toggled off expiration', () => {
    const { container, queryByRole } = render(
      <Expiration
        policy={new Virtru.Client.VirtruPolicyBuilder().build()}
        policyChange={() => {}}
      />,
    );
    expect(container.querySelector('input[type=checkbox]').checked).toBeFalsy();
    expect(queryByRole('textinput')).toBeFalsy();
  });

  test('Custom', () => {
    const setPolicy = jest.fn();
    const policy = new Virtru.Client.VirtruPolicyBuilder().build();
    const policyChange = change => generatePolicyChanger(policy, setPolicy, change);
    const now = new Date();
    let later = new Date(now);
    later.setMinutes(now.getMinutes() + 5, 0, 0);
    const { container } = render(
      <Expiration policy={policy} policyChange={policyChange} now={now} />,
    );

    const checkbox = container.querySelector('input[type=checkbox]');
    fireEvent.click(checkbox);

    expect(setPolicy).toBeCalledWith(
      expect.objectContaining({
        _deadline: later.toISOString(),
      }),
    );
  });
});
