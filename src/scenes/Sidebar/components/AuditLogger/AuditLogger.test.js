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
import { render, getByTestId, fireEvent } from '@testing-library/react';
import AuditLogger from './AuditLogger';
import moment from 'moment';
import auditEvents from 'constants/auditEvents';
import * as Download from 'utils/download';

describe('AuditLogger', () => {
  test('renders "Protect a file..." text if events array is empty', () => {
    const { getByText } = render(<AuditLogger auditLog={[]} />);
    expect(getByText('Protect a file to enable tracking')).toBeInTheDocument();
  });

  test('renders AuditEventItem if events array is not empty', () => {
    const event = {
      auditDataType: 'FILE.ACCESS_SUCCEEDED',
      userId: 'foo@bar.com',
      timestamp: '2019-07-15T14:48:22+00:00',
      recordId: 0,
    };
    const { getByText } = render(<AuditLogger auditLog={{ events: [event] }} />);
    const formattedDate = moment(event.timestamp).format('hh:mm:ss');

    expect(getByText(auditEvents[event.auditDataType])).toBeInTheDocument();
    expect(getByText(formattedDate)).toBeInTheDocument();
    expect(getByText(event.userId)).toBeInTheDocument();
  });

  test('should save file on download icon click', () => {
    const event = {
      auditDataType: 'FILE.ACCESS_SUCCEEDED',
      userId: 'foo@bar.com',
      timestamp: '2019-07-15T14:48:22+00:00',
      recordId: 0,
    };
    Download.saver = jest.fn();

    const { container } = render(<AuditLogger auditLog={{ events: [event] }} />);

    fireEvent.click(getByTestId(container, 'auditEventDownload'));
    expect(Download.saver).toHaveBeenCalledTimes(1);
  });
});
