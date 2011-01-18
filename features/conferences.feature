Feature: Conferences
  In order to know about conferences and their participants
  As a user
  I want to see a list of conferences
  
  Scenario: see list of conferences
    Given a category "JavaScript"
      And a category "Ruby"
      And a conference "JSconf EU" in the category "JavaScript" with start date "01.05.2011" and end date "04.05.2011" and description "The best JavaScript conference in the world!" located in "Adalbertstr. 7, 10999 Berlin"
    When I go to the start page
    Then I should see "JSconf EU"  
  
  Scenario: create a conference
    Given a category "JavaScript"
      And a user "hans" with the password "test"
      And I log in as "hans/test"
    When I follow "Create Conference"
      And I fill in "Name" with "JSconf EU"
      And I select "JavaScript" from "Category"
      And I fill in "Start Date" with "01.05.2011"
      And I fill in "End Date" with "04.05.2011"
      And I fill in "Description" with "The best JavaScript conference in the world!"
      And I fill in "Street" with "Adalbertstr. 7"
      And I fill in "Zip Code" with "10999"
      And I fill in "City" with "Berlin"
      And I press "Add Conference"
    Then I should see "Conference created successfully"
      And I should see "JSconf EU"
  