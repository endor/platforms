// origin: M

var ContactRequest = require('models/contact_request'),
  _ = require('../../public/vendor/underscore/underscore')._;

module.exports = function(app) {
  app.post('/contact_requests', function(req, res) {
    var contact_request = ContactRequest.fromParams(req.body);

    app.db.view('users', 'by_username', {include_docs: true, key: contact_request.target_username}, app.handleError(res, function(user_doc) {
      contact_request.target_user_id = user_doc.rows[0].doc._id;
      contact_request.source_user_id = contact_request.source_user_id || req.session.user_id;
      app.db.saveDoc(contact_request.toDoc(), app.handleError(res, function(ok) {
        contact_request.version = ok.rev;
        contact_request.id = ok.id;
        res.send(contact_request.toApi(), 200);
      }));      
    }));
  });
  
  app.put('/contact_requests/:request_id', function(req, res) {
    app.db.getDoc(req.params.request_id, app.handleError(res, function(doc) {
      var contact_request = ContactRequest.fromDoc(doc);
      contact_request.accepted = req.body.accepted;
      app.db.saveDoc(contact_request.toDoc(), app.handleError(res, function(ok) {
        contact_request.version = ok.rev;
        contact_request.id = ok.id;
        res.send(contact_request.toApi(), 200);
      }));
    }));
  });
  
  var retrieve_contact_requests = function(view) {
    var return_contact_requests = function(res, contact_requests) {
      res.send(_(contact_requests).map(function(cr) { return cr.toApi(); }), 200);      
    };
    
    return function(req, res) {
      app.db.view('contact_requests', view, {include_docs: true, key: req.session.user_id }, app.handleError(res, function(contact_requests) {
        contact_requests = _(contact_requests.rows).map(function(row) {return ContactRequest.fromDoc(row.doc); });
        
        if(view === 'by_accepted_source_or_target_user_id') {
          var keys = _(contact_requests).map(function(cr) {
            return cr.source_username === req.session.username ? cr.target_username : cr.source_username;
          });
          app.db.view('users', 'by_username', {include_docs: true, keys: keys}, app.handleError(res, function(users) {            
            _(users.rows).each(function(user_doc) {
              var user = User.fromDoc(user_doc.doc);
              var request = _(contact_requests).select(function(cr) { return cr.source_username === user.username || cr.target_username === user.username; })[0];
              request.email = user.email;
              request.fullname = user.fullname;
            });
            return_contact_requests(res, contact_requests);
          }));
        } else {
          return_contact_requests(res, contact_requests);
        }
      }));
    };
  };
  
  app.get('/sent_contact_requests', retrieve_contact_requests('by_source_user_id'));
  app.get('/received_contact_requests', retrieve_contact_requests('by_target_user_id'));
  app.get('/accepted_contact_requests', retrieve_contact_requests('by_accepted_source_or_target_user_id'));
};