import React from 'react';

import { render } from '@testing-library/react';
import SdkLogger from './SdkLogger.js';

describe('SdkLogger', () => {
  test('Should trigger window.PR.prettyPrint every time component renders', () => {
    render(<SdkLogger collapse={() => {}} events={[]} />);
    expect(window.PR.prettyPrint).toHaveBeenCalled();
  });
});
