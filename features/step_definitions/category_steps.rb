Given /^I create a category "(\w+)"$/ do |name|
  Platforms.post '/ws/categories', :body => { :name => name }
end

Given /^a category "(\w+)"$/ do |name|
  Given 'I log in as "admin/admin"'
    And %Q{I create a category "#{name}"}
    And 'I press "Log out"'
end
