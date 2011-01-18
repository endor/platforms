Given /I create a conference "([^\"]+)" in the category "([^\"]+)" with start date "([^\"]+)" and end date "([^\"]+)" and description "([^\"]+)" located in "([^\"]+)"/ do |name, category, start_date, end_date, description, address|
  Platforms.post '/conferences', :body => { :name => name, :category => category, :start_date => start_date, :end_date => end_date, :description => description, :address => address }
end

Given /^a conference "([^\"]+)" in the category "([^\"]+)" with start date "([^\"]+)" and end date "([^\"]+)" and description "([^\"]+)" located in "([^\"]+)"/ do |name, category, start_date, end_date, description, address|
  Given 'a user "admin" with the password "admin"'
    And 'I log in as "admin/admin"'
    And %Q{I create a conference "#{name}" in the category "#{category}" with start date "#{start_date}" and end date "#{end_date}" and description "#{description}" located in "#{address}"}
    And 'I press "Log out"'
end
