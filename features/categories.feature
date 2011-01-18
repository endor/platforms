Feature: Categories
  In order to easily evaluate which conferences I want to go to
  As a user
  I want to see categories
  
Scenario: see list of categories on the start page
  Given a user "admin" with the password "admin"
    And I log in as "admin/admin"
    And I create a category "JavaScript"
    And I create a category "Ruby"
    And I follow "Log out"
  When I go to the start page
  Then I should see "JavaScript"
    And I should see "Ruby"
