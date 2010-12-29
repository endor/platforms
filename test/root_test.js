// Run $ expresso

var app = require('../server'),
  sys = require('sys');
  
if(process.env.EXPRESS_ENV != 'test') {
  sys.print('please set EXPRESS_ENV to test');
  process.exit(-1);
};


module.exports = {
  'GET / with correct host renders': function(assert) {
    assert.response(app, {
      url: '/',
      method: 'GET',
      headers: {
          'Host': 'localhost:3000'
        },
      },
      {
        status: 200
      });
  }
};

