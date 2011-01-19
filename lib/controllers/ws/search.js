// origin: M
// search controller, handles search requests for conferences

var buildQuery = require('../../build_query'),
  qs = require('querystring');

module.exports = function(app) {
  app.get('/ws/search/:query', function(req, res) {
    app.db.request('/_fti/_design/conference/search?include_docs=true&default_operator=AND&q=' + qs.escape(buildQuery(qs.unescape(req.params.query))), app.handleError(res, function(result) {
      if(result.rows !== undefined) {
        if(result.rows.length == 0) {
          res.send(204);
        } else {
          var conferences = [];
          result.rows.forEach(function(row) {
            Conference.fromDoc(row.doc).toEmbeddedApi(req, app.db, app.handleError(res, function(api_doc) {
              conferences.push(api_doc);
              if(conferences.length == result.rows.length) {
                res.send(conferences, 200);
              }
            }));
          });
        }
      } else {
        res.send(result, 500);
      }
    }));
  });
};