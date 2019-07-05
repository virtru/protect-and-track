import React from 'react';
import { render, fireEvent, getByTestId, act } from '@testing-library/react';

import { Pure as SidebarLogger } from './SidebarLogger';

describe('SidebarLogger', () => {
  test('Should render button if closed and sidebarBody if opened', () => {
    const { container, rerender } = render(<SidebarLogger tdfLog={[]} />);
    const button = getByTestId(container, 'sidebarButton');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(getByTestId(container, 'sidebarBody')).toBeInTheDocument();

    const sidebarCloseButton = getByTestId(container, 'sidebarCloseButton');
    fireEvent.click(sidebarCloseButton);
    rerender(<SidebarLogger tdfLog={[]} />);
    expect(getByTestId(container, 'sidebarButton')).toBeInTheDocument();
  });

  test('Should render nothing if useIsPortrait hook matches portrait resolution', () => {
    const { container } = render(<SidebarLogger />);
    expect(container).not.toBeEmpty();

    const mql = window.matchMedia();
    mql.matches = true;
    act(() => {
      mql._triggerEvents();
    });

    expect(container).toBeEmpty();
  });
});
