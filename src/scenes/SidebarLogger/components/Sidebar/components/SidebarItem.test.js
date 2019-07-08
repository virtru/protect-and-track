import React from 'react';

import { render } from '@testing-library/react';
import SidebarItem from './SidebarItem';

const mockConstructor = jest.fn();
const mockDestroy = jest.fn();

jest.mock('clipboard', () => {
  return jest.fn().mockImplementation(() => {
    mockConstructor();
    return { destroy: mockDestroy };
  });
});

describe('SidebarItem', () => {
  test('Should call clipboard constructor on render and destructor on unmount', () => {
    const { unmount } = render(<SidebarItem title="foo" code="bar" />);
    expect(mockConstructor).toHaveBeenCalled();
    unmount();
    expect(mockDestroy).toHaveBeenCalled();
  });
});
