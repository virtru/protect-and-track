import React from 'react';
import { render, act } from '@testing-library/react';

import { useIsPortrait } from './useIsPortrait.js';

const IsPortraitWrapper = () => <div>{useIsPortrait() ? 'is portrait' : 'is landscape'}</div>;

describe('SidebarLogger', () => {
  test('Should render false if useIsPortrait hook matches portrait resolution', () => {
    const { getByText } = render(<IsPortraitWrapper />);
    expect(getByText('is landscape')).toBeInTheDocument();

    const mql = window.matchMedia();
    mql.matches = true;
    act(() => {
      mql._triggerEvents();
    });

    expect(getByText('is portrait')).toBeInTheDocument();
  });
});
