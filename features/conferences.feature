Feature: Conferences
  In order to know about conferences and their participants
  As a user
  I want to see a list of conferences
  
  Scenario: see list of conferences
    Given a user "admin" with the password "admin"
      And a category "JavaScript"
      And a category "Ruby"
      And a conference "JSconf EU" in the category "JavaScript" with start date "01.05.2011" and end date "04.05.2011" and description "The best JavaScript conference in the world!" located in "Adalbertstr. 7, 10999 Berlin"
    When I go to the start page
    Then I should see "JSconf EU"
    When I follow "Ruby"
    Then I should not see "JSconf EU"
    When I go to the start page
      And I follow "JavaScript"
    Then I should see "JSconf EU"
  
  Scenario: create a conference
    Given a user "admin" with the password "admin"
      And a category "JavaScript"
      And a user "hans" with the password "test"
      And I log in as "hans/test"
    When I follow "Create Conference"
      And I fill in "Name" with "JSconf EU"
      And I check "conference_JavaScript"
      And I fill in "Start Date" with "01.05.2011"
      And I fill in "End Date" with "04.05.2011"
      And I fill in "Description" with "The best JavaScript conference in the world!"
      And I fill in "Location" with "Adalbertstr. 7, 10999 Berlin"
      And I press "Add Conference"
    Then I should see "Conference created successfully"
      And I should see "JSconf EU"
  
  Scenario: attend a conference
    Given a user "admin" with the password "admin"
      And a category "JavaScript"
      And a conference "JSconf EU" in the category "JavaScript" with start date "01.05.2011" and end date "04.05.2011" and description "The best JavaScript conference in the world!" located in "Adalbertstr. 7, 10999 Berlin"
      And a user "hans" with the password "test"
      And a user "klaus" with the password "test"
      And I log in as "hans/test"
      And I follow "JSconf EU"
      And I press "Attend"
    Then I should see "You are attending this conference!"
    When I follow "Log out"
      And I log in as "klaus/test"
      And I follow "JSconf EU"
    Then I should see "hans"