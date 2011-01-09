Given /^"([^"]*)" is logged in$/ do |username|
  When 'I go to the start page'
  And 'I follow "Log in"'
  And %Q{I fill in "Username" with "#{username}"}
  And %Q{I fill in "Password" with "test"}
  And 'I press "Log in"'
end

Then /^I should be logged out$/ do
  When 'I go to the start page'
  Then 'I should not see "Log out"'
end

Then /^I should be logged in$/ do
  When 'I go to the start page'
  Then 'I should see "Log out"'
end
