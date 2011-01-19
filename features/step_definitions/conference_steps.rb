Given /I create a conference "([^\"]+)" in the category "([^\"]+)" with start date "([^\"]+)" and end date "([^\"]+)" and description "([^\"]+)" located in "([^\"]+)"/ do |name, category, start_date, end_date, description, location|
  When 'I follow "Create Conference"'
  And %Q{I fill in "Name" with "#{name}"}
  And %Q{I check "conference_#{category}"}
  And %Q{I fill in "Start Date" with "#{start_date}"}
  And %Q{I fill in "End Date" with "#{end_date}"}
  And %Q{I fill in "Description" with "#{description}"}
  And %Q{I fill in "Location" with "#{location}"}
  And 'I press "Add Conference"'
end

Given /^a conference "([^\"]+)" in the category "([^\"]+)" with start date "([^\"]+)" and end date "([^\"]+)" and description "([^\"]+)" located in "([^\"]+)"/ do |name, category, start_date, end_date, description, location|
  Given 'I log in as "admin/admin"'
    And %Q{I create a conference "#{name}" in the category "#{category}" with start date "#{start_date}" and end date "#{end_date}" and description "#{description}" located in "#{location}"}
    And 'I press "Log out"'
end
