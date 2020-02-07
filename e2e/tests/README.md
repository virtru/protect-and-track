## Run Tests

- E2E tests:

  - Make sure SAUCE_USER, SAUCE_PASS, you can find them in 1Password
  - `npm run test-e2e`, available environment vars:
    - any valid TEST_ENVIRONMENT_NAME, such as production, staging, or develop01
    - any valid TEST_MARKER, such as smoke and regression.
  - WARNING: due to e2e tests requires BP CRX to send secure email, it could be very slow when uploading BP CRX to SauceLabs for testing, especially when BP CRX files are large

  - [automated-test-scripts-v3](https://github.com/virtru/automated-test-scripts-v3) is to provide BDD-based tests to make it simpler to be understood across team.
  - Benefits of using [automated-test-scripts-v3](https://github.com/virtru/automated-test-scripts-v3):
    - Separation of concerns. tests(including the feature files and the skeleton test_xxx.py files) can now reside inside of the product repo, without the need to switch context to different repos
    - Common BDD step implementations and 3rd party integrations will be provided by automated-test-scripts-v3
    - It is possible to provide a `conftest.py` file in the same `e2e` test folder to override or define new test step implementations
    - No need to use triggered steps, test steps and test reports will be available directly in the product build pipeline.
  - TEST_ENVIRONMENT_NAME determines which URL the e2e test will run against, in BuildKite CI/CD pipelines:
    - For master/staging/develop branches, TEST_ENVIRONMENT_NAME will be set based on BUILDKITE_BRANCH accordingly
    - for other branches, TEST_ENVIRONMENT_NAME will be based on DEPLOY_ENVIRONMENT_NAME, currently only develop01 is supported, because it needs BP CRX with that environment in chrome store to be able to run the tests
  - For detailed use cases and explanations, please refer [use cases section](https://github.com/virtru/automated-test-scripts-v3#use-cases)
