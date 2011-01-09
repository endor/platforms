Given /^"([^"]*)" is logged in$/ do |username|
  When 'I go to the start page'
  And 'I follow "Login"'
  And %Q{I fill in "Username" with "#{username}"}
  And %Q{I fill in "Password" with "test"}
  And 'I press "Login"'
end

Then /^I should not be logged in$/ do
  Then 'I should not see "Logout"'
end

Then /^I should be logged out$/ do
  When 'I go to the start page'
  Then 'I should not see "Logout"'
end

Then /^I should be logged in$/ do
  When 'I go to the start page'
  Then 'I should see "Logout"'
end
