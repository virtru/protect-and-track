TODO: Replace with real scenarios.
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
    Given Project is protect-and-track-demo

  @regression
  Scenario Outline: Decrypt TDF3 file in SR
    Given a TDF3 file: <filename>
    When I start to run testrail <case_id>
    And qavirtru31@cmk-test-org.com logged in secure-reader page using a new browser
    And the user drag and drop the file in secure-reader page
    And the file automatically decrypt in secure-reader page
    Then screen comparison shall have similarity(0.0-1.0) greater than 0.999

    Examples:
      | filename      | case_id |
      | tdf3.pdf.html | 247842  |
      | tdf3.pdf.tdf  | 247849  |
