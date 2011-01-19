// origin: M

cap.ConferenceSearch = function(app) {
  app.get('#/conference_search', function(context) {
    if(context.params.query !== undefined) {
      context.get('/ws/search/' + context.params.query, function(conferences) {
        context.partial('views/conference_search/index.mustache',
            {searched: true, result_count: (conferences || []).length,
              conferences: context.escapeDetails(conferences || []),
              found_anything: (conferences || []).length > 0});
      });
    } else {
      context.partial('views/conference_search/index.mustache');
    };
  });
}