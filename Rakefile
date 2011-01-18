# run all tests

require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

require 'cucumber/rake/task'
Cucumber::Rake::Task.new(:cucumber, 'Run cucumber features') do |t|
  t.fork = false
end

task :default => [:vows, :'jasmine:ci', :cucumber] do
  
end

task :vows do
  require File.dirname(__FILE__) + '/features/support/run_server'
  puts `vows #{ENV['TESTS'] || 'vows/**/*-test.js'}`
end

