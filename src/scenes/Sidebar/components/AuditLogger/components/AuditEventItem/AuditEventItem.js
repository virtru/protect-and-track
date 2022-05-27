import React from 'react';
import moment from 'moment';
import './AuditEventItem.css';
import { AUDIT_EVENTS } from 'constants/auditEvents';
import { ReactComponent as Doc } from 'assets/doc.svg';
import { ReactComponent as Download } from 'assets/download.svg';

export const AuditEventItem = ({ auditDataType, userId, timestamp, index, onDownload }) => (
  <div className="auditEventWrapper">
    <div className="auditEventIconWrapper">
      <Doc className="docIcon" />
    </div>
    <div className="auditEventInfoWrapper">
      <div className="auditEventInfoHeader">{AUDIT_EVENTS[auditDataType]}</div>
      <div className="auditEventInfoEmail">{userId}</div>
    </div>
    <div className="auditEventDownloadWrapper">
      <Download
        className="downloadIcon"
        onClick={() => onDownload(index)}
        data-testid="auditEventDownload"
      />
      <div className="auditEventTimestamp">{moment(timestamp).format('hh:mm:ss')}</div>
    </div>
  </div>
);
