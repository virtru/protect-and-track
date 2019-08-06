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
      <div className="auditEventTimestamp">{moment(timestamp).format('hh:mm:ss')}</div>
    </div>
  </div>
);
