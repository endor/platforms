module.exports = {
  computeStatusCode: function(request, code) {
    if(request.isXMLHttpRequest) {
      return 200;
    } else {
      return code;
    }
  }
};
