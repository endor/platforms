skeleton.ApplicationHelper = {
  post: function(url, data, success, error) {
    $.ajax({
      method: 'POST',
      url: url,
      data: data,
      success: success,
      error: error
    });
  }
};
