import React from 'react';
import { render, getByTestId, fireEvent } from '@testing-library/react';
import AuditLogger from './AuditLogger';
import moment from 'moment';
import auditEvents from 'constants/auditEvents';
import { saver } from 'utils/download';

jest.mock('file-saver');

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
    const saveAs = jest.fn();
    saver.mockImplementation(saveAs);

    const { container } = render(<AuditLogger auditLog={{ events: [event] }} />);

    fireEvent.click(getByTestId(container, 'auditEventDownload'));
    expect(saveAs).toHaveBeenCalledTimes(1);
  });
});
