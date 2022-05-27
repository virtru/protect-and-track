import React from 'react';
import { connect } from 'redux-zero/react';
import { parse as parseCsvToJson } from 'json2csv';
import './AuditLogger.css';
import { Scrollbars } from 'react-custom-scrollbars';
import { AuditEventItem } from './components/AuditEventItem/AuditEventItem';
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

  const onDownload = (i) => {
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
