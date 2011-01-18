Given /^"([^"]*)" is logged in$/ do |username|
  Given %Q{I log in as "#{username}/test"}
end

Then /^I should not be logged in$/ do
  Then 'I should not see "Log out"'
end

Then /^I should be logged out$/ do
  When 'I go to the start page'
  Then 'I should not see "Log out"'
end

Then /^I should be logged in$/ do
  When 'I go to the start page'
  page.should have_xpath('//input[@value=\'Log out\']')
end

Given /^I log in as "([^"]*)"$/ do |user_password|
  user, password = user_password.split('/')
  When 'I go to the start page'
  And 'I follow "Log in"'
  And %Q{I fill in "Username" with "#{user}"}
  And %Q{I fill in "Password" with "#{password}"}
  And 'I press "Log in"'
end