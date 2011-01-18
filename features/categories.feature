Feature: Categories
  In order to easily evaluate which conferences I want to go to
  As a user
  I want to see categories
  
  Scenario: see list of categories on the start page
    Given a user "admin" with the password "admin"
      And I log in as "admin/admin"
      And I create a category "JavaScript"
      And I create a category "Ruby"
      And I create a category "Rails" within "Ruby"
      And I press "Log out"
    When I go to the start page
    Then I should see "JavaScript"
      And I should see "Ruby"
      But I should not see "Rails"
    When I follow "Ruby"
    Then I should see "Rails"
    When I go to the start page
      And I follow "JavaScript"
    Then I should not see "Rails"

  Scenario: create a category
    Given a user "admin" with the password "admin"
      And a category "ProgrammingLanguages"
      And I log in as "admin/admin"
    When I follow "Create Category"
      And I fill in "Name" with "JavaScript"
      And I select "ProgrammingLanguages" from "Parent Category"
      And I press "Add Category"
    Then I should see "Category successfully created"
      And I should see "ProgrammingLanguages"
      And I should see "JavaScript"