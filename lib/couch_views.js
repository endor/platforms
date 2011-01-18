var design_docs = {
  conference: {
    views: {
      by_category: {
        map: function(doc) {
          if(doc.type === 'conference') {
            doc.categories.forEach(function(category) {
              emit(category.id, null);              
            });
          };
        }
      },
      all: {
        map: function(doc) {
          if(doc.type === 'conference') {
            emit(doc.id, null);
          };
        }        
      }
    }
  },
  category: {
    views: {
      top_level: {
        map: function(doc) {
          if(doc.type == 'Category' && !doc.parent_id) {
            emit(doc.name, 1);
          }
        }
      },
      by_id: {
        map: function(doc) {
          if(doc.type == 'Category') {
            emit(doc._id, 1);
          }
        }
      },
      by_name: {
        map: function(doc) {
          if(doc.type == 'Category') {
            emit(doc.name, 1);
          }
        }
      },
      by_parent_id: {
        map: function(doc) {
          if(doc.type == 'Category' && doc.parent_id) {
            emit(doc.parent_id, 1);
          }          
        }
      }
    }
  }
};

module.exports.update_views = function(db, _, callback) {
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
        if(callback) {
          callback();
        };
      });
    });
  });
};