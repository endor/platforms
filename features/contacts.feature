Feature: Contacts
  In order to associate with other users
  As a user
  I want to get in contact with other users
  
  Scenario: send and accept contact request
    Given a user "frank" with the password "test" and email "frank@tank.de"
      And a user "alex" with the password "test" and email "alex@clubma.te"
      And I log in as "frank/test"
    When I go to the start page
      And I follow "Search Members"
    Then I should not see "Send Contact Request to frank"
    When I press "Send Contact Request to alex"
    Then I should see "Successfully sent contact request to alex"
      And I follow "Home"
    Then I should see "alex"
    When I follow "Search Members"
    Then I should see "alex"
    When I press "Log out"
    When I log in as "alex/test"
    Then I should see "frank"
    When I press "Accept"
    Then I should see "Successfully created contact with frank"
      And I should see "frank@tank.de"
    When I press "Log out"
      And I log in as "frank/test"
    Then I should see "alex@clubma.te"
  