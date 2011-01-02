var _ = require('../../public/vendor/underscore/underscore')._;

module.exports.Model = {
  from_params: function(params) {
    var model = _(params).extend({});

    return model;
  }
};
