Given /^I create a category "(\w+)"$/ do |name|
  Platforms.post '/ws/categories', :body => { :name => name }
end

Given /^a category "(\w+)" within "(\w+)"$/ do |name, parent|
  Given 'I log in as "admin/admin"'
    Platforms.post '/ws/categories', :body => { :name => name, :parent => { :name => parent } }
    And 'I press "Log out"'  
end

Given /^a category "(\w+)"$/ do |name|
  Given 'I log in as "admin/admin"'
    And %Q{I create a category "#{name}"}
    And 'I press "Log out"'
end
