Feature: Categories
  In order to easily evaluate which conferences I want to go to
  As a user
  I want to see categories
  
  Scenario: see list of categories on the start page
    Given a user "admin" with the password "admin"
      And a category "JavaScript"
      And a category "Ruby"
      And a category "Node" within "JavaScript"
    When I go to the start page
    Then I should see "JavaScript"
      And I should see "Ruby"
      But I should not see "Node"
    When I follow "JavaScript"
    Then I should see "Node"

  Scenario: create a category
    Given a user "admin" with the password "admin"
      And a category "ProgrammingLanguages"
      And I log in as "admin/admin"
    When I follow "Create Category"
      And I fill in "Name" with "JavaScript"
      And I select "ProgrammingLanguages" from "Parent Category"
      And I press "Add Category"
    Then I should see "Category successfully created"
    When I follow "ProgrammingLanguages"
    Then I should see "JavaScript"