require "rubygems"
require "bundler/setup"
require 'json'
require 'capybara/cucumber'
require 'test/unit'
require 'test/unit/assertions'
include Test::Unit::Assertions
require 'httparty'
require File.dirname(__FILE__) + '/config'

ENV['NODE_ENV'] = 'test'
ENV['SKIP_UPDATE_VIEWS'] = 'true'

Capybara.app = nil
Capybara.app_host = APP_HOST
Capybara.javascript_driver = :selenium
Capybara.default_driver = :selenium

def patiently(&block)
  yield
  # cycles = 0
  # begin
  #   yield
  # rescue  => e
  #   cycles += 1
  #   sleep 0.1
  #   if cycles < 10
  #     retry 
  #   else
  #     raise e
  #   end
  # end
end

Before do
  reset_database
end