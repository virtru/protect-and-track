import { AnalyticsService } from 'analytics-service';
import { version } from '../../package.json';

const PLATFORM = 'protect-and-track';

const EVENT_NAMES = {
  DEMO_LAND: 'Demo Land',
  FILE_DOWNLOAD_ATTEMPT: 'File Download Attempt',
  FILE_DOWNLOAD_COMPLETE: 'File Download Complete',
  FILE_DOWNLOAD_ERROR: 'File Download Error',
  FILE_SHARE_ATTEMPT: 'File Share Attempt',
  FILE_SHARE_SELECT: 'File Share Select',
  FILE_SHARE_COMPLETE: 'File Share Complete',
  LOGIN_ATTEMPT: 'Login Attempt',
  LOGIN_COMPLETED: 'Login Completed',
  LOGIN_ERROR: 'Login Error',
};

const defaultProperties = {
  'user.platform': PLATFORM,
  'user.platform.version': version,
};

const options = {
  key: process.env.REACT_APP_AMPLITUDE_KEY,
  frontEnd: true,
  defaultProperties,
};

const analytics = new AnalyticsService(options);

const trackLogin = ({ userId, file }) => {
  const hasTrackedLogin = localStorage.getItem('virtru-demo-login-tracked');
  analytics.updateProperties({
    'user.email': userId,
    'user.domain': userId.split('@')[1],
  });
  analytics.identify({ userId });
  if (!hasTrackedLogin) {
    analytics.track({
      event: EVENT_NAMES.LOGIN_COMPLETED,
      properties: {
        fileType: file.file.type,
        fileSize: `${file.arrayBuffer.byteLength / 1000}KB`,
      },
    });
  }
  localStorage.setItem('virtru-demo-login-tracked', true);
};

const trackShareEvent = ({ policy, file, destination, event, error }) => {
  analytics.track({
    event,
    properties: {
      fileType: file.type,
      fileSize: `${file.payload.byteLength / 1000}KB`,
      destination,
      isSecure: true,
      'policy.Id': policy.getPolicyId(),
      'policy.type': 'file',
      'policy.usersWithAccessCount': policy.getUsersWithAccess().length,
      'policy.expirationDeadline': policy.getExpirationDeadline(),
      'policy.hasWatermarking': policy.hasWatermarking(),
      'policy.hasReshare': policy.hasReshare(),
      'error.name': error && error.name,
      'error.message': error && error.message,
      'error.stack': error && error.stack,
    },
  });
};

const trackShareAttempt = ({ policy, file }) => {
  trackShareEvent({ policy, file, event: EVENT_NAMES.FILE_SHARE_ATTEMPT });
};

const trackShareSelect = ({ policy, file, destination }) => {
  trackShareEvent({ policy, file, destination, event: EVENT_NAMES.FILE_SHARE_SELECT });
};

const trackShareComplete = ({ policy, file, destination }) => {
  trackShareEvent({ policy, file, destination, event: EVENT_NAMES.FILE_SHARE_COMPLETE });
};

const trackShareError = ({ policy, file, destination, error }) => {
  trackShareEvent({ policy, file, destination, event: EVENT_NAMES.FILE_SHARE_ERROR, error });
};

const trackDownload = ({
  encrypted,
  event,
  extension = 'file',
  isSecure = false,
  error,
  policy,
}) => {
  console.log(`Tracking ${event}`);
  analytics.track({
    event,
    properties: {
      fileType: encrypted.type,
      fileSize: `${encrypted.payload.byteLength / 1000}KB`,
      extension,
      isSecure,
      'policy.Id': policy.getPolicyId(),
      'policy.type': 'file',
      'policy.usersWithAccessCount': policy.getUsersWithAccess().length,
      'policy.expirationDeadline': policy.getExpirationDeadline(),
      'policy.hasWatermarking': policy.hasWatermarking(),
      'policy.hasReshare': policy.hasReshare(),
      'error.name': error && error.name,
      'error.message': error && error.message,
      'error.stack': error && error.stack,
    },
  });
};

export {
  analytics as default,
  EVENT_NAMES,
  trackLogin,
  trackShareAttempt,
  trackShareSelect,
  trackShareComplete,
  trackShareError,
  trackDownload,
};
