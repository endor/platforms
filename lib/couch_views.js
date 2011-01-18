var design_docs = {
  design_doc: {
    views: {
      view: {
        map: function(doc) {}
      }
    }
  }
};

module.exports.update_views = function(db, _) {
  _(design_docs).each(function(doc, name) {
    db.getDoc('_design/' + name, function(err, old_design_doc) {
      if(old_design_doc) {
        doc._id = old_design_doc._id;
        doc._rev = old_design_doc._rev;
      };
      db.saveDesign(name, doc, function(_err, res) {
        if(_err) {
          console.log(_err);
        };
      });
    });
  });
};