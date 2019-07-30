import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders loader if isLoading set as true', () => {
    const { getByText } = render(
      <App
        appIdBundle={false}
        setAppIdBundle={() => {}}
        isLoading={true}
        setIsLoading={() => {}}
      />,
    );
    expect(getByText('Protect & Track Demo')).toBeInTheDocument();
  });
});
