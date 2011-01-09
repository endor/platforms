require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

require 'cucumber/rake/task'
Cucumber::Rake::Task.new(:cucumber, 'Run cucumber features') do |t|
  t.fork = false
end

task :default => [:expresso, :jasmine, :cucumber] do
  
end

task :expresso do
  `expresso`
end