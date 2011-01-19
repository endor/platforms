// origin: M
// Middleware to check for authentication

var user_authentication_middleware = function(db){
  // pulic paths
  var public_paths = {
    'PUT': [/\/session$/],
    'GET': [/\/ws\/members\/new/, /\/session$/, /\/ws\/conferences/, /\/ws\/categories/, /^\/$/, /^\/index.html$/],
    'POST': [/\/ws\/members$/],
    'DELETE': []
  },
  
  check_credentials = function(credentials, req){
    if(credentials.username === "admin" && credentials.password === "admin"){
      return(true);
    } else {
      db.getDoc(User.toId(credentials.username), function(err, user_doc) {
        if(err) {
          return(false);
        } else {
          var user = User.fromDoc(user_doc);
          if(user.authenticate(credentials.password)) {
            req.session.user_id = user._id;
            req.session.username = user.username;
            return(true);
          } else {
            return(false);
          }
        }
      });
    }
  },
  
  allowed_request = function(req) {
    if(_(public_paths[req.method]).select(function(pattern){
      return req.url.match(pattern);
    }).length > 0){
      return(true);
    }else{ 
      return(false);
    }
  }
  
  return(function (req, res, next) {
    if(allowed_request(req) || req.session.user_id){
      
      next();
    } else {
      var credentials;
      if(req.headers['authorization'] && 
          (credentials = decodeBase64(req.headers['authorization'])) && 
          check_credentials(credentials, req)){
        next();
      } else {
        res.send(403);
      }
    }
  });
};

module.exports = user_authentication_middleware;

function decodeBase64(headerValue) {
  var value = headerValue.match("^Basic\\s([A-Za-z0-9+/=]+)$");
  if (value)
  {
      var auth = (new Buffer(value[1] || "", "base64")).toString("ascii");
      return({
          username : auth.slice(0, auth.indexOf(':')),
          password : auth.slice(auth.indexOf(':') + 1, auth.length)
      });
  }
  else
  {
      return null;
  }
}
