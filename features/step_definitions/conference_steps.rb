Given /I create a conference "([^\"]+)" in the category "([^\"]+)" with start date "([^\"]+)" and end date "([^\"]+)" and description "([^\"]+)" located in "([^\"]+)"/ do |name, category, start_date, end_date, description, address|
  Platforms.post '/conferences', :body => { :name => name, :category => category, :start_date => start_date, :end_date => end_date, :description => description, :address => address }
end
