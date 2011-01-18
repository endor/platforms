require "bundler/setup"
require 'httparty'

unless $server_pid
  STDERR.puts 'starting node'
  $server_pid = Process.spawn({'CONNECT_ENV' => 'test', 'PORT' => '3001'}, 'node server.js')
  begin
    HTTParty.get 'http://127.0.0.1:3001/index.html'
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