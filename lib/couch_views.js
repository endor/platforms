// origin: RM
// create views for CouchDB to query it

var design_docs = {
  contact_requests: {
    views: {
      by_source_user_id: {
        map: function(doc) {
          if(doc.type === 'ContactRequest') {
            emit(doc.source_user_id, 1);
          }
        }
      },
      by_target_user_id: {
        map: function(doc) {
          if(doc.type === 'ContactRequest') {
            emit(doc.target_user_id, 1);
          }
        }
      }
    }
  },
  conference: {
    fulltext: {
      search: {
        index: function(doc) {
          if(doc.type == 'Conference') {
            var ret = new Document();
            ret.add(doc.name, {field: 'name'});
            ret.add(doc.name);
            if(doc.description) {
              ret.add(doc.description, {field: 'description'});
              ret.add(doc.description);
            };
            if(doc.enddate) {
              var date_components = doc.enddate.match(/(\d{4})(\d{2})(\d{2})/);
              ret.add(date_components[1] + '-' + date_components[2] + '-' + date_components[3], {type: 'date', field: 'enddate'})
            }
            return ret;
          }
          
        }
      }
    },
    views: {
      by_category_id: {
        map: function(doc) {
          if(doc.type === 'Conference') {
            doc.category_ids.forEach(function(category_id) {
              emit(category_id, 1);
            });
          };
        }
      },
      all: {
        map: function(doc) {
          if(doc.type === 'Conference') {
            emit(doc._id, null);
          };
        }        
      }
    }
  },
  attendees: {
    views: {
      by_conference_id: {
        map: function(doc) {
          if(doc.type === 'Attendance') {
            emit(doc.conference_id, 1);
          }
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
  },
  users: {
    views: {
      by_username: {
        map: function(doc) {
          if(doc.type == 'User') {
            emit(doc.username, null);
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