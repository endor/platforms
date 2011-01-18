APP_HOST = 'http://127.0.0.1:3001'

def reset_database
  url = 'http://localhost:5984'
  @db_name = 'platforms_test'
  HTTParty.delete "#{url}/#{@db_name}" rescue nil
  HTTParty.put "#{url}/#{@db_name}"
  HTTParty.put APP_HOST + "/update_views" rescue nil
end
