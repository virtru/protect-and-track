import { datadogLogs } from '@datadog/browser-logs';
import { datadogRum } from '@datadog/browser-rum';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'redux-zero/react';
import { dispatchAuth } from './utils/dispatchAuth';

import './index.css';
import App from './scenes/App/App';
import * as serviceWorker from './serviceWorker';
import store from './store';

{
  const ddCfg = {
    clientToken: 'puba880a3d33c8a569513d1119834aeb6e5',
    site: 'datadoghq.com',
    service: process.env.REACT_APP_NAME || 'protect-and-track-local',
    env: process.env.REACT_APP_VIRTRU_ENV || 'local',
    version: process.env.REACT_APP_VERSION || '0.0.1',
    sampleRate: 100,
  };
  datadogRum.init({
    ...ddCfg,
    applicationId: '575c63b8-eb4f-468e-8b29-6edd87f3452a',
    sessionReplaySampleRate: 20,
    trackInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  });
  datadogLogs.init({
    ...ddCfg,
    forwardErrorsToLogs: true,
  });
  datadogRum.startSessionReplayRecording();
}

console.info(
  `AppInfo: ${process.env.REACT_APP_NAME}:${process.env.REACT_APP_VERSION}-${
    process.env.REACT_APP_BUILD_NUMBER || '0'
  }`,
);
if (dispatchAuth()) {
  // TODO consider rendering 'loading' or something. Also handle errors?
  // 'close' or 'app' <- close closes window, home reloads app
  // Maybe try to do the localstorage bits of the auth flows, too, in case we are here by mistake?
  // dispatchAuth just sends a message to the parent window, but if auth parts use clientside storage
  // we could do that part so the auth will work on a refresh (or click of the 'app' button above)
} else {
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
