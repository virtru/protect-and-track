import React from 'react';
import { render, fireEvent, getByTestId, act } from '@testing-library/react';

import { Pure as UserSelect } from './UserSelect';
const history = { push: jest.fn() };

describe('UserSelect', () => {
  test('Should trigger alert and console.error with specific messages if form submitted with empty text input', () => {
    const { container } = render(<UserSelect history={{}} />);
    const consoleSpy = jest.spyOn(console, 'error');
    fireEvent.submit(getByTestId(container, 'formBox'));
    expect(window.alert).toBeCalledWith('A valid email address must be included');
    expect(consoleSpy).toBeCalledWith('Ensure an email address is provided');
  });

  test('Should push history with value stetted in email input', () => {
    const { container } = render(<UserSelect history={history} />);
    document.getElementById('email').value = 'fooBar';
    fireEvent.submit(getByTestId(container, 'formBox'));
    expect(history.push).toBeCalledWith('auth?id=fooBar');
  });
});
