import React from 'react';
import moment from 'moment';

import Sidebar from './Sidebar';
import { render } from '@testing-library/react';

describe('SdkLogger', () => {
  test('Should render Protect a file to see SDK calls if logs are empty', () => {
    const { getByText } = render(<Sidebar tdfLog={[]} auditEvents={[]} />);
    expect(getByText('Protect a file to see SDK calls')).toBeInTheDocument();
  });

  test('Should render SdkLoggs if tdfLog array not empty', () => {
    const tdfLog = [{ title: 'event', code: "var foo = 'bar'", timestamp: moment('2019-01-01') }];
    const { getByText } = render(<Sidebar tdfLog={tdfLog} auditEvents={[]} />);
    expect(getByText('event')).toBeInTheDocument();
    expect(getByText("var foo = 'bar'")).toBeInTheDocument();
    expect(getByText('12:00:00')).toBeInTheDocument();
  });
});
