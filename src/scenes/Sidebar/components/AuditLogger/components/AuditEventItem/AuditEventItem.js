import React from 'react';
import moment from 'moment';
import './AuditEventItem.css';
import auditEvents from 'constants/auditEvents';
import { ReactComponent as Doc } from 'assets/doc.svg';
import { ReactComponent as Download } from 'assets/download.svg';

export default ({ auditDataType, userId, timestamp, index, onDownload }) => (
  <div className="auditEventWrapper">
    <div className="auditEventIconWrapper">
      <Doc className="docIcon" />
    </div>
    <div className="auditEventInfoWrapper">
      <div className="auditEventInfoHeader">{auditEvents[auditDataType]}</div>
      <div className="auditEventInfoEmail">{userId}</div>
    </div>
    <div className="auditEventDownloadWrapper">
      <Download
        className="downloadIcon"
        onClick={() => onDownload(index)}
        data-testid="auditEventDownload"
      />
      <div className="auditEventTimestamp">{moment(timestamp).format('HH:MM:SS')}</div>
    </div>
  </div>
);
