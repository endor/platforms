class Platforms
  include HTTParty
  base_uri 'localhost:3000'
  format :json
  default_params :output => 'json'
end

Given /^I create a category "(\w+)"$/ do |name|
  Platforms.post '/categories', :query => { :name => name }
end