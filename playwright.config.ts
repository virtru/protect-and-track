import { PlaywrightTestConfig, devices } from '@playwright/test';
import * as dotenv from "dotenv";
// @ts-ignore
dotenv.config({ multiline: true });

/* See https://playwright.dev/docs/test-configuration. */
const config: PlaywrightTestConfig = {
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    testDir: './e2e',
    forbidOnly: Boolean(process.env.CI),
    /* Retry on CI only */
    retries: 0,
    /* Opt out of parallel tests on CI and Local env for now (due to test failures with multiple workers - PLAT-1774  */
    workers: 1,
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    // globalSetup: require.resolve('./global-setup'),
    use: {
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        acceptDownloads: true,

        // actionTimeout: 3 * 60 * 1000,
        // navigationTimeout: 30 * 1000,
        // // storageState: './tests/e2e/storageState.json',
        // /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        // // actionTimeout: 0,
        // /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: "https://local.virtru.com/",
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'retain-on-failure',
        // screenshot: 'only-on-failure',
        // browserName: "firefox",
        // // headless: Boolean(process.env.CI),
        headless: false,
        launchOptions: {
          slowMo: 25,
          // args: ['--disable-component-extensions-with-background-pages']
        },
        // contextOptions: {
        //     ignoreHTTPSErrors: true
        // },
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
        name: 'setup-non-cks',
        use: { ...devices['Desktop Firefox'] },
        testMatch: /.*\.setup-non-cks\.ts/ ,
      },
      {
        name: 'non-cks',
        testMatch: '*.non-cks.spec.ts',
        use: {
          ...devices['Desktop Chrome'],
        },
        dependencies: ['setup-non-cks'],
      },
      {
        name: 'setup-cks',
        use: { ...devices['Desktop Firefox'] },
        testMatch: /.*\.setup-cks\.ts/ ,
      },
      {
        name: 'cks',
        testMatch: '*.cks.spec.ts',
        use: {
          ...devices['Desktop Chrome'],
        },
        dependencies: ['setup-cks'],
      },
    ],
};

export default config;
