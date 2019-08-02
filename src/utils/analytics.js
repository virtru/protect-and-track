import { AnalyticsService } from 'analytics-service';
import { version } from '../../package.json';

const PLATFORM = 'protect-track';

const defaultProperties = {
  'user.platform': PLATFORM,
  'user.platform.version': version,
};

const options = {
  key: '3e6592f019223965c6f403818496b6e6',
  frontEnd: true,
  defaultProperties,
};

const analytics = new AnalyticsService(options);

export { analytics as default };
