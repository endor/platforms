// origin: M

cap.ContactRequests = function(app) {
  app.post('#/contact_requests', function(context) {
    context.redirect('#/');
  });
}