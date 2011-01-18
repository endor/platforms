# run all tests

require 'jasmine'
load 'jasmine/tasks/jasmine.rake'
require 'cucumber/rake/task'


namespace :cucumber do

  Cucumber::Rake::Task.new(:all, 'Run all cucumber features') do |t|
    t.fork = false
  end

  Cucumber::Rake::Task.new(:wip, 'Run features that are being worked on') do |t|
    t.fork = false # You may get faster startup if you set this to false
    t.profile = 'wip'
  end
end
task cucumber: ['cucumber:all']

task :default => [:vows, :'jasmine:ci', :cucumber] do
  
end

task :vows do
  require File.dirname(__FILE__) + '/features/support/run_server'
  puts `export CONNECT_ENV=test; vows #{ENV['TESTS'] || 'vows/**/*-test.js'}`
end

desc "Reset development enviroment"
task :reset do
  `curl -X POST localhost:3000/reset`
end

desc "Load test data"
task :factory_defaults do
  `curl -X POST localhost:3000/factorydefaults`
end

