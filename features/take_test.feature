Feature: Take test
  In order to see your compatibility to other users
  As a user
  I want to take the personality test
  
  Scenario: take personality test
    Given I am on the new test result page
    And show me the page
    When I choose "Good"
      And I choose "Yes"
      And I choose "Very much"
      And I press "Show me my personality!"
    Then I should see "You have successfully taken the test. Thanks."
  