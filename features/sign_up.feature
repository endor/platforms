Feature: Sign up
  Scenario: succeeds
    When I go to the start page
      And I follow "Register"
      And I fill in "Alexander Lang" for "Full Name"
      And I fill in "_@alex.io" for "Email"
      And I fill in "Berlin" for "Town"
      And I fill in "Germany" for "Country"
      And I fill in "langalex" for "Username"
      And I fill in "test" for "Password"
      And I press "Register"
    Then I should see "Welcome langalex"
  
  Scenario: fails with invalid username
    When I go to the start page
      And I follow "Register"
      And I fill in "Alexander Lang" for "Full Name"
      And I fill in "_@alex.io" for "Email"
      And I fill in "Berlin" for "Town"
      And I fill in "" for "Country"
      And I fill in "langalex" for "Username"
      And I fill in "test" for "Password"
      And I press "Register"
    Then I should see "can't be blank."

  Scenario: fails because user already exists
    Given a user "alex"
    When I go to the start page
      And I follow "Register"
      And I fill in the signup form as "alex"
      And I press "Register"
    Then I should see "is already taken."