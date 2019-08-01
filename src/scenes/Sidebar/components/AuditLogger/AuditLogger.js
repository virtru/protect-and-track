import React from 'react';
import { connect } from 'redux-zero/react';
import FileSaver from 'file-saver';
import { parse as parseCsvToJson } from 'json2csv';
import './AuditLogger.css';
import { Scrollbars } from 'react-custom-scrollbars';
import AuditEventItem from './components/AuditEventItem/AuditEventItem';

const { useEffect, useRef } = React;

const AuditLogger = ({ auditLog = {} }) => {
  const scroll = useRef();
  const { error, events = [], status } = auditLog;
  useEffect(() => {
    if (!scroll.current) return;
    const scrollHeight = scroll.current.getScrollHeight();
    scroll.current.scrollTop(scrollHeight);
  }, [auditLog]);

  const onDownload = i => {
    const csvContent = parseCsvToJson(events[i]);
    const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, `${events[i].recordId}.csv`);
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
        <h4>Error while connecting to audit service.</h4>
        {contents}
      </div>
    );
  }
  return contents;
};

const mapToProps = ({ auditEvents }) => ({ auditLog: auditEvents });
export default connect(mapToProps)(AuditLogger);
