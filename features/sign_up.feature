Feature: Sign up
  Scenario: succeeds
    When I go to the start page
      And I follow "Register"
      And I fill in "Alexander Lang" for "Full Name"
      And I fill in "_@alex.io" for "Email"
      And I fill in "Berlin" for "Town"
      And I fill in "sail away" for "Life Motto"
      And I fill in "langalex" for "Username"
      And I fill in "test" for "Password"
      And I fill in "you can fly" for "Seconday Life Motto"
      And I press "Register"
    Then I should see "Welcome langalex"
  
  Scenario: fails with invalid username
    When I go to the start page
      And I follow "Register"
      And I fill in "Alexander Lang" for "Full Name"
      And I fill in "_@alex.io" for "Email"
      And I fill in "Berlin" for "Town"
      And I fill in "sail away" for "Life Motto"
      And I fill in "" for "Username"
      And I fill in "test" for "Password"
      And I fill in "you can fly" for "Seconday Life Motto"
      And I press "Register"
    Then I should see "can't be blank."

