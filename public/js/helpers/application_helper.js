(function() {
  var send = function(type, url, data, success, error) {
    $.ajax({
      type: type,
      url: url,
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: success,
      error: function(xhr) { error(JSON.parse(xhr.responseText)); }
    });    
  };
  
  skeleton.ApplicationHelper = {
    flash: function(message) {
      $('#flash').html(message).show().delay(2000).fadeOut('slow');
    },
    
    post: function(url, data, success, error) {
      send('POST', url, data, success, error);
    },

    get: function(url, data, success, error) {
      send('GET', url, data, success, error);
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
