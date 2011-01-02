STDERR.puts 'starting node'
  $server_pid = Process.spawn({'NODE_ENV' => 'test', 'PORT' => '3001'}, 'node server.js')
  begin
    HTTParty.get Capybara.app_host
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