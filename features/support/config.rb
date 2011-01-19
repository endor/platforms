APP_HOST = 'http://127.0.0.1:3001'

def reset_database
  HTTParty.get APP_HOST + "/reset" rescue nil
end
