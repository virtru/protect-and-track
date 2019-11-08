Feature: SDK Demo Site
  As an end user,
  I want to use SDK Demo site to check if TDF3 files worked,
  So I can develop my own app using TDF3.

  # Scenarios can be highly declarative, which focuses on behavior.
  # Don't get caught up in button names and layouts at the Gherkin level.
  # Note that these scenarios use Selenium WebDriver to do browser interactions.

  # for every Then assertion, we require a case_id, which is TestRail Case ID
  # https://virtru.testrail.net/index.php?/dashboard
  # Talk to QA Leads before you create Test Cases in TestRail

  Background:
    Given Project is secure-reader

  @smoke
  Scenario: Decrypt TDF3 file in SR
    When I start to run testrail 12345
    And qavirtrumd11@cmk-test-org.com logged in gmail using a new browser with BP activated
    And an email to qavirtrumd12@cmk-test-org.com is being composed
    And secure toggle is turned on
    And email subject is any string
    And email body is message1
    And email is sent securely

  Scenario: Test with Ken1
    When I start to run testrail 12345
    And qavirtrumd11@cmk-test-org.com logged in gmail using a new browser with BP activated
    And an email to qavirtrumd12@cmk-test-org.com is being composed
    And secure toggle is turned on
    And email subject is any string
    And email body is message1
    And email is sent securely
