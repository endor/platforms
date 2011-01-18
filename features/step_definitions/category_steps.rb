Given /^I create a category "(\w+)"$/ do |name|
  Platforms.post '/categories', :body => { :name => name }
end
