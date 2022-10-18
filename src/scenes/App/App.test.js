import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { fireEvent } from '@testing-library/react';

const noop = () => {
  // Ignored function.
};

describe('App', () => {
  test('renders loader if isLoading set as true', () => {
    const { getByText } = render(
      <App
        isLoading={true}
        setIsLoading={noop}
        continueAnyway
        updateFileData={noop}
      />,
    );
    expect(getByText('Protect & Track Demo')).toBeInTheDocument();
  });

  test('should trigger setContinueAnyway on button click', () => {
    const spy = jest.fn();
    const { getByText } = render(
      <App
        isLoading={true}
        setIsLoading={noop}
        setContinueAnyway={spy}
        updateFileData={noop}
      />,
    );
    fireEvent.click(getByText('Continue Anyway'));
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
