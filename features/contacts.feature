Feature: Contacts
  In order to associate with other users
  As a user
  I want to get in contact with other users
  
  Scenario: send contact request
    Given a user "frank" with the password "test"
      And a user "alex" with the password "test"
      And I log in as "frank/test"
    When I go to the start page
      And I follow "Search Members"
      And I press "Send Contact Request to alex"
      And I follow "Home"
    Then I should see "alex"
  