Feature: Log in

  Scenario: log in successfully
    Given a user "alex" with the password "test"
    When I go to the start page
      And I follow "Log in"
      And I fill in "Username" with "alex"
      And I fill in "Password" with "test"
      And I press "Log in"
    Then I should be logged in
    
  Scenario: invalid username
    Given a user "alex" with the password "test"
    When I go to the start page
      And I follow "Log in"
      And I fill in "Username" with "blex"
      And I fill in "Password" with "test"
      And I press "Log in"
    Then I should not be logged in
      And I should see "not found"
    
  Scenario: invalid password
    Given a user "alex" with the password "test"
    When I go to the start page
      And I follow "Log in"
      And I fill in "Username" with "alex"
      And I fill in "Password" with "xyz"
      And I press "Log in"
    Then I should not be logged in
      And I should see "does not match the password on record"