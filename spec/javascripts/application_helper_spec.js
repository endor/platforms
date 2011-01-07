describe("ApplicationHelper", function() {
  var helper = skeleton.ApplicationHelper;

  it("should reformat the nested errors to match input field names", function() {
    var result = helper.formatErrors({user: {login: ['err1'], email: ['err2']}});
    expect(result).toEqual({'user[login]': 'err1', 'user[email]': 'err2'});
  });
  
  it("should join the errors into a single string", function() {
    var result = helper.formatErrors({user: {login: ['err1', 'err2']}});
    expect(result).toEqual({'user[login]': 'err1, err2'});
  });
});