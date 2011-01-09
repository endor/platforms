Feature: Log out
  
  Scenario: log out
    Given a user "alex"
      And "alex" is logged in
    When I go to the start page
      And I follow "Log out"
    Then I should be logged out