Given /^a user "([^"]*)"$/ do |username|
  When 'I go to the start page'
  And 'I follow "Register"'
  And %Q{I fill in the signup form as "#{username}"}
  And 'I press "Register"'
end

Given /^a user "([^"]*)" with the password "([^"]*)"$/ do |username, password|
  When 'I go to the start page'
  And 'I follow "Register"'
  And %Q{I fill in the signup form as "#{username}"}
  And %Q{I fill in "#{password}" for "Password"}
  And 'I press "Register"'
end

When /^I fill in the signup form as "([^"]*)"$/ do |username|
  And %Q{I fill in "Alexander Lang" for "Full Name"}
  And %Q{I fill in "_@alex.io" for "Email"}
  And %Q{I fill in "Berlin" for "Town"}
  And %Q{I fill in "sail away" for "Life Motto"}
  And %Q{I fill in "#{username}" for "Username"}
  And %Q{I fill in "test" for "Password"}
  And %Q{I fill in "you can fly" for "Secondary Life Motto"}
end
