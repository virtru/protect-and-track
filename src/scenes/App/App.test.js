import React from 'react';
import { render, getByTestId } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders loader if isLoading set as true', () => {
    const { container } = render(
      <App
        appIdBundle={false}
        setAppIdBundle={() => {}}
        isLoading={true}
        setIsLoading={() => {}}
      />,
    );
    expect(getByTestId(container, 'loadingInProgress')).toBeInTheDocument();
  });
});
