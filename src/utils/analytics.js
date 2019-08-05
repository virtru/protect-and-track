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
  LOGIN_ATTEMPT: 'Login Attempt',
  LOGIN_COMPLETED: 'Login Completed',
  LOGIN_ERROR: 'Login Error',
  FILE_SHARE_COMPLETE: 'File Share Complete',
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

export { analytics, EVENT_NAMES };
