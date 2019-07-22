import React from 'react';
import Virtru from 'virtru-tdf3-js';
import { cleanup, fireEvent, render } from '@testing-library/react';

import Expiration from './Expiration';

afterEach(cleanup);

describe('Expiration', () => {
  test('Renders a toggled off expiration', () => {
    const { container, queryByRole } = render(
      <Expiration policy={new Virtru.Client.VirtruPolicyBuilder().build()} />,
    );
    expect(container.querySelector('input[type=checkbox]').checked).toBeFalsy();
    expect(queryByRole('textinput')).toBeFalsy();
  });

  test('Custom', () => {
    const updatePolicy = jest.fn();
    let d = new Date();
    d.setMinutes(d.getMinutes() + 5, 0, 0);
    const { container } = render(
      <Expiration
        policy={new Virtru.Client.VirtruPolicyBuilder().build()}
        updatePolicy={updatePolicy}
        now={d}
      />,
    );

    const checkbox = container.querySelector('input[type=checkbox]');
    fireEvent.click(checkbox);

    expect(updatePolicy).toBeCalledWith(
      expect.objectContaining({
        _deadline: d.toISOString(),
      }),
    );
  });
});
