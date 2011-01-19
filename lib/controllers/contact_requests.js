// origin: M

var ContactRequest = require('models/contact_request');

module.exports = function(app) {
  app.post('/contact_requests', function(req, res) {
    var contact_request = ContactRequest.fromParams(req.body);

    app.db.view('users', 'by_username', {include_docs: true, key: contact_request.target_username}, app.handleError(res, function(user_doc) {
      contact_request.target_user_id = user_doc.rows[0].doc._id;
      app.db.saveDoc(contact_request.toDoc(), app.handleError(res, function(ok) {
        contact_request.version = ok.rev;
        contact_request.id = ok.id;
        res.send(contact_request.toApi(), 200);
      }));      
    }));
  });
  
  app.get('/contact_request', function(req, res) {
    app.db.view('contact_requests', 'by_source_user_id', {include_docs: true, key: req.session.user_id }, app.handleError(res, function(contact_requests) {
      contact_requests = _(contact_requests.rows).map(function(row) {return ContactRequest.fromDoc(row.doc).toApi(); });
      res.send(contact_requests, 200);
    }));
  });
};