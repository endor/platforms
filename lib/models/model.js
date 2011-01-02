var _ = require('../../public/js/underscore')._;

module.exports.Model = {
  from_params: function(params) {
    var model = _(params).extend({});

    return model;
  }
};
