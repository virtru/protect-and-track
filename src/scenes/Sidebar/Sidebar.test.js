// MIT License
//
// Copyright (c) 2019 Virtru Corporation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import React from 'react';
import moment from 'moment';

import Sidebar from './Sidebar';
import { render } from '@testing-library/react';

describe('SdkLogger', () => {
  test('Should render Protect a file to see SDK calls if logs are empty', () => {
    const { getByText } = render(<Sidebar tdfLog={[]} auditEvents={false} />);
    expect(getByText('Protect a file to see SDK calls')).toBeInTheDocument();
  });

  test('Should render SdkLogs if tdfLog array not empty', () => {
    const tdfLog = [{ title: 'event', code: "var foo = 'bar'", timestamp: moment('2019-01-01') }];
    const { getByText } = render(<Sidebar tdfLog={tdfLog} />);
    expect(getByText('event')).toBeInTheDocument();
    expect(getByText("var foo = 'bar'")).toBeInTheDocument();
    expect(getByText('12:00:00')).toBeInTheDocument();
  });
});
