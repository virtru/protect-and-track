import { PlaywrightTestConfig, devices } from '@playwright/test';
import * as dotenv from "dotenv";
// @ts-ignore
dotenv.config({ multiline: true });

/* See https://playwright.dev/docs/test-configuration. */
const config: PlaywrightTestConfig = {
    testDir: './e2e',
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: Boolean(process.env.CI),
    /* Retry on CI only */
    retries: process.env.CI ? 3 : 1,
    /* Opt out of parallel tests on CI and Local env for now (due to test failures with multiple workers - PLAT-1774  */
    workers: 3,
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    // globalSetup: require.resolve('./global-setup'),
    use: {
        viewport: { width: 500, height: 720 },
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: "https://local.virtru.com/",
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'retain-on-failure',
        headless: true,
        launchOptions: {
          slowMo: 500,
        },
    },
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000
    },
    /* Maximum time one test can run for. */
    timeout: 5 * 60 * 1000,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Configure projects for major browsers */
    projects: [
      {
        name: 'setup-phase-0',
        use: { ...devices['Desktop Firefox'] },
        fullyParallel: true,
        testMatch: 'auth[0,1,2].setup-*',
      },
      {
        name: 'non-cks',
        testMatch: '*.non-cks.spec.ts',
        use: { ...devices['Desktop Chrome'] },
        dependencies: ['setup-phase-0'],
      },
      {
        name: 'setup-phase-1',
        use: { ...devices['Desktop Firefox'] },
        fullyParallel: true,
        testMatch: 'auth[0,1,3].setup-*',
        dependencies: ['non-cks'],
      },
      {
        name: 'cks',
        testMatch: '*.cks.spec.ts',
        use: { ...devices['Desktop Chrome'] },
        dependencies: ['setup-phase-1'],
      },
      {
        name: 'setup-phase-2',
        use: { ...devices['Desktop Firefox'] },
        fullyParallel: true,
        testMatch: 'auth[0,2,3].setup-*',
        dependencies: ['cks'],
      },
      {
        name: 'unhappy paths cks user',
        testMatch: '*.unhappy-path-cks.spec.ts',
        use: { ...devices['Desktop Chrome'] },
        dependencies: ['setup-phase-2'],
      },
      {
        name: 'setup-phase-3',
        use: { ...devices['Desktop Firefox'] },
        fullyParallel: true,
        testMatch: 'auth[0,1,2].setup-*',
        dependencies: ['unhappy paths cks user'],
      },
      {
        name: 'unhappy paths non cks user',
        testMatch: '*.unhappy-path-non-cks.spec.ts',
        use: { ...devices['Desktop Chrome'] },
        dependencies: ['setup-phase-3'],
      },
    ],
};

export default config;
