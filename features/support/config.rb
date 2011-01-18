APP_HOST = 'http://127.0.0.1:3001'

def reset_database
  HTTParty.post APP_HOST + "/reset" rescue nil
end
