import React, { useEffect } from 'react';
import { connect } from 'redux-zero/react/index';

import './Alert.css';

function Alert({ alert, clearAlert }) {
  useEffect(() => {
    if (!alert) {
      return;
    }
    const timer = setTimeout(() => {
      clearAlert(alert);
    }, 8000);
    return () => clearTimeout(timer);
  }, [alert, clearAlert]);

  if (!alert) {
    return null;
  }

  return (
    <div className="Alert">
      <img alt="" src="danger-small.svg" onClick={() => clearAlert(alert)} />
      {alert}
    </div>
  );
}

const mapToProps = ({ alert }) => ({ alert });
const actions = {
  // TODO clean up alerts smarter
  // E.g make alerts {message, timestamp} or have a sequence id
  clearAlert: ({ alert: currentAlert }, oldAlert) =>
    currentAlert === oldAlert ? { alert: false } : {},
};
export default connect(mapToProps, actions)(Alert);
