Given /^a user "([^"]*)"( with the password "([^"]*)")?( and email "([^"]*)")?$/ do |username, _, password, _, email|
  Platforms.post "/ws/members", :body => {:email => email || "#{username}@email.pf",
    :username => username,
    :fullname => "#{username} doe",
    :password => password || "test",
    :town => "Berlin",
    :country => "Country"}
  Platforms.delete "/session"
end

When /^I fill in the signup form as "([^"]*)"$/ do |username|
  And %Q{I fill in "Alexander Lang" for "Full Name"}
  And %Q{I fill in "_@alex.io" for "Email"}
  And %Q{I fill in "Berlin" for "Town"}
  And %Q{I fill in "Germany" for "Country"}
  And %Q{I fill in "#{username}" for "Username"}
  And %Q{I fill in "test" for "Password"}
end
