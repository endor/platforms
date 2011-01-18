(function() {
  var send = function(type, context, url, data, success, error) {
    if(typeof(data) == 'function') {
      success = data;
      error = success;
    }
    error = error || function() {};
    
    $.ajax({
      type: type,
      url: url,
      data: data ? JSON.stringify(data) : null,
      contentType: 'application/json',
      success: success,
      error: function(xhr) {
        if(xhr.status === 403) {
          skeleton.current_user = null;
          skeleton.requestBeforeSessionTimeout = context;
          skeleton.app.runRoute('get', '#/session/new');
        } else {
          error(JSON.parse(xhr.responseText));
        }
      }
    });    
  };
  
  skeleton.ApplicationHelper = {
    flash: function(message) {
      $('#flash').html(message).show().delay(2000).fadeOut('slow');
    },
    
    post: function(url, data, success, error) {
      send('POST', this, url, data, success, error);
    },

    get: function(url, data, success, error) {
      send('GET', this, url, data, success, error);
    },
    
    put: function(url, data, success, error) {
      send('PUT', this, url, data, success, error);
    },
    
    del: function(url, data, success, error) {
      send('DELETE', this, url, data, success, error);
    },

    formatErrors: function(errors) {
      var formattedErrors = {};
      _.each(errors, function(attributes, clazz) {
        _.each(attributes, function(messages, attribute) {
          formattedErrors[clazz + '[' + attribute + ']'] = messages.join(', ');
        });
      });
      return formattedErrors;
    },
    
    showErrors: function(form_id, context, errors) {
      $(form_id).validate().showErrors(context.formatErrors(errors));
    }
  };
  
})();
