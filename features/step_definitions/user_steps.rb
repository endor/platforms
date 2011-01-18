Given /^a user "([^"]*)"$/ do |username|
  When 'I go to the start page'
  And 'I follow "Register"'
  And %Q{I fill in the signup form as "#{username}"}
  And 'I press "Register"'
  And 'I press "Log out"'
end

Given /^a user "([^"]*)" with the password "([^"]*)"$/ do |username, password|
  When 'I go to the start page'
  And 'I follow "Register"'
  And %Q{I fill in the signup form as "#{username}"}
  And %Q{I fill in "#{password}" for "Password"}
  And 'I press "Register"'
  And 'I press "Log out"'
end

When /^I fill in the signup form as "([^"]*)"$/ do |username|
  And %Q{I fill in "Alexander Lang" for "Full Name"}
  And %Q{I fill in "_@alex.io" for "Email"}
  And %Q{I fill in "Berlin" for "Town"}
  And %Q{I fill in "Germany" for "Country"}
  And %Q{I fill in "#{username}" for "Username"}
  And %Q{I fill in "test" for "Password"}
end
