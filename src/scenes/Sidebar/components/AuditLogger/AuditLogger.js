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
import { connect } from 'redux-zero/react';
import { parse as parseCsvToJson } from 'json2csv';
import './AuditLogger.css';
import { Scrollbars } from 'react-custom-scrollbars';
import AuditEventItem from './components/AuditEventItem/AuditEventItem';
import { saver } from 'utils/download';

const { useEffect, useRef } = React;

const AuditLogger = ({ auditLog = {} }) => {
  const scroll = useRef();
  const { error, events = [] } = auditLog;
  useEffect(() => {
    if (!scroll.current) return;
    const scrollHeight = scroll.current.getScrollHeight();
    scroll.current.scrollTop(scrollHeight);
  }, [auditLog]);

  const onDownload = i => {
    const csvContent = parseCsvToJson(events[i]);
    const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8' });
    saver(blob, `${events[i].recordId}.csv`);
  };

  const contents = events.length ? (
    <Scrollbars ref={scroll} autoHide>
      <div className="auditEventsWrapper">
        {events.map((event, i) => (
          <AuditEventItem {...event} key={event.recordId} onDownload={onDownload} index={i} />
        ))}
      </div>
    </Scrollbars>
  ) : (
    <p>Protect a file to enable tracking</p>
  );
  if (error) {
    return (
      <div>
        <h4 className="AuditLogger-error">
          <img alt="" src="call-fail.svg" /> Error while connecting to audit service.
        </h4>
        {contents}
      </div>
    );
  }
  return contents;
};

const mapToProps = ({ auditEvents }) => ({ auditLog: auditEvents });
export default connect(mapToProps)(AuditLogger);
