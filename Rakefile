require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

require 'cucumber/rake/task'
Cucumber::Rake::Task.new(:cucumber, 'Run cucumber features') do |t|
  t.fork = false
end

task :default => [:vows, :expresso, :'jasmine:ci', :cucumber] do
  
end

task :vows do
  `vows vows/models/*.js vows/controllers/*.js`
end

task :expresso do
  `expresso`
end