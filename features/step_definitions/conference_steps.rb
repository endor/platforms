Given /I create a conference "([^\"]+)" in the category "([^\"]+)" with start date "([^\"]+)" and end date "([^\"]+)" and description "([^\"]+)" located in "([^\"]+)"/ do |name, category, start_date, end_date, description, location|
  p Platforms.post '/ws/conferences', :body => { :name => name, :categories => [{:id => "category-#{category}"}], :startdate => start_date, :enddate => end_date, :description => description, :location => location }
end

Given /^a conference "([^\"]+)" in the category "([^\"]+)" with start date "([^\"]+)" and end date "([^\"]+)" and description "([^\"]+)" located in "([^\"]+)"/ do |name, category, start_date, end_date, description, location|
  Given 'I log in as "admin/admin"'
    And %Q{I create a conference "#{name}" in the category "#{category}" with start date "#{start_date}" and end date "#{end_date}" and description "#{description}" located in "#{location}"}
    And 'I press "Log out"'
end
