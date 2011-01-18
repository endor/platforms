var vows_http = require(__dirname + '/../../vendor/vows-http/index');

module.exports = {
  create: function(username, callback){
    vows_http.post("/users", callback(), { username: username, password: "test", fullname: "Alex Lang", town: "Berlin", country: "Germany"});
  }
};