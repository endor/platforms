Feature: search conferences

  Background:
    Given a user "admin" with the password "admin"
      And a category "JavaScript"
      And a conference "JSconf EU" in the category "JavaScript" with start date "20110501" and end date "20110504" and description "The best JavaScript conference in the world!" located in "Adalbertstr. 7, 10999 Berlin"
    

  Scenario: Find matching conference
    When I go to the start page
      And I follow "Search Conferences"
      And I fill in "Query" with "javascript"
      And I press "Search"
    Then I should see "JSconf"
  
  Scenario: find none
    When I go to the start page
      And I follow "Search Conferences"
      And I fill in "Query" with "ruby"
      And I press "Search"
    Then I should see "No conferences found."
