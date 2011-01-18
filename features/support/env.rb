require "rubygems"
require "bundler/setup"
require 'json'
require 'capybara/cucumber'
require 'test/unit'
require 'test/unit/assertions'
include Test::Unit::Assertions
require 'httparty'

ENV['NODE_ENV'] = 'test'
ENV['SKIP_UPDATE_VIEWS'] = 'true'

Capybara.app = nil
Capybara.app_host = 'http://127.0.0.1:3001'
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

class Platforms
  include HTTParty
  base_uri 'localhost:3000'
  format :json
end

Before do
  url = 'http://localhost:5984'
  @db_name = 'platforms_test'
  HTTParty.delete "#{url}/#{@db_name}" rescue nil
  HTTParty.put "#{url}/#{@db_name}"
  HTTParty.put Capybara.app_host + "/update_views"
end