import React from 'react';
import { connect } from 'redux-zero/react';
import FileSaver from 'file-saver';
import { parse as parseCsvToJson } from 'json2csv';
import './AuditLogger.css';
import { Scrollbars } from 'react-custom-scrollbars';
import AuditEventItem from './components/AuditEventItem/AuditEventItem';

const { useEffect, useRef } = React;

const AuditLogger = ({ auditLog }) => {
  const scroll = useRef();
  useEffect(() => {
    if (!scroll.current) return;
    const scrollHeight = scroll.current.getScrollHeight();
    scroll.current.scrollTop(scrollHeight);
  }, [auditLog]);

  const onDownload = i => {
    const csvContent = parseCsvToJson(auditLog[i]);
    const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, `${auditLog[i].recordId}.csv`);
  };

  return auditLog.length ? (
    <Scrollbars ref={scroll} autoHide>
      <div className="auditEventsWrapper">
        {auditLog.map((event, i) => (
          <AuditEventItem {...event} key={event.recordId} onDownload={onDownload} index={i} />
        ))}
      </div>
    </Scrollbars>
  ) : (
    <p>Protect a file to enable tracking</p>
  );
};

const mapToProps = ({ auditLog }) => ({ auditLog });
export default connect(mapToProps)(AuditLogger);
