require "bundler/setup"
require 'httparty'
require File.dirname(__FILE__) + '/config'

unless $server_pid
  STDERR.puts 'starting node'
  reset_database
  $server_pid = Process.spawn({'CONNECT_ENV' => 'test', 'PORT' => '3001'}, 'node server.js')
  begin
    HTTParty.get APP_HOST + '/index.html'
  rescue Errno::ECONNREFUSED => e
    sleep 0.1
    retry
  end
  STDERR.puts 'node started'

  at_exit do
    if $server_pid
      `kill #{$server_pid}`
    end
  end
end

