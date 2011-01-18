Feature: Conferences
  In order to know about conferences and their participants
  As a user
  I want to see a list of conferences
  
  Scenario: see list of conferences
    Given a user "admin" with the password "admin"
      And I log in as "admin/admin"
      And I create a category "JavaScript"
      And I create a category "Ruby"
      And I create a conference "JSconf EU" in the category "JavaScript" with start date "01.05.2011" and end date "04.05.2011" and description "The best JavaScript conference in the world!" located in "Adalbertstr. 7, 10999 Berlin"
      And I press "Log out"
    When I go to the start page
    Then I should see "JSconf EU"  
  