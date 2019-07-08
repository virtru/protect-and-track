import React, { useRef } from 'react';

import { render } from '@testing-library/react';
import Siebar from './Sidebar';

describe('Sidebar', () => {
  test('Should trigger window.PR.prettyPrint every time component renders', () => {
    render(<Siebar collapse={() => {}} events={[]} />);
    expect(window.PR.prettyPrint).toHaveBeenCalled();
  });
});
