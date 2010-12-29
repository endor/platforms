$(function() {
  // tag editor
  (function() {
    var resize_view_indicator = function() {
      $('#filters .view_indicator').css('height', $('#filters ul').css('height'));
    }
    var tag_editor_options = {
      separator: ',',
      completeOnSeparator: true,
      completeOnBlur: true,
      afterAppend: resize_view_indicator,
      afterRemove: resize_view_indicator
    };
    
    $("#apartment_tags, #tags").autocomplete("/tags", {
  		highlight: false,
  		scroll: true
  	});
    
    $("#apartment_tags").tagEditor(_(tag_editor_options).extend({appendTagsTo: '#tags_for_apartment'}));
    $("#tags").tagEditor(_(tag_editor_options).extend({appendTagsTo: '#tags_for_search'}));
    
    $("#tags").bind('tags-changed', function() {
      $(window).trigger('reload-apartments');
    });
  })();
         
  // transloadit
  var form = $('#new_apartment form');
  var transloadit_params = {
    auth: {
      key: '4c791226c09040dd98af27d472ec3211'
    },
    steps: {
      small: {robot: '/image/resize', width: 220, height: 140, use: ':original'},
      middle: {robot: '/image/resize', width: 320, height: 240, use: ':original'},
      big: {robot: '/image/resize', width: 640, height: 480, use: ':original'},
      store: {robot: '/s3/store', use: ['small', 'middle', 'big']}
    },
    redirect_url: 'http://' + w4lls.host + '/apartments'
  }
  
  var stringified_transloadit_params = JSON.stringify(transloadit_params);
  
  form.find('#transloadit_params').val($('<div></div>').text(stringified_transloadit_params).html());
  form.find('#apartment_availability').datepicker();


  form.transloadit({
    wait: true,
    autoSubmit: false,
    onSuccess: function(assembly) {          
      form.prepend($('<input type="hidden" name="transloadit"/>').val(JSON.stringify(assembly)));
      form.ajaxSubmit({
        no_file_uploads: true,
        success: function(apartment) {
          if(apartment && apartment.lat && apartment.lng) {
            w4lls.show_apartment(apartment, w4lls.map);
          }
          $("#top_slider").slideUp("normal");
          form.find('input:text:enabled, input:checkbox:enabled, input:radio:enabled, input:file:enabled').val('');
          form.find('ul.tagEditor *').remove();
        }
      });
    },
    beforeStart: function() {
      var errors = [];
      var error = function(id, msg) {
        errors.push({id: id, msg: msg});
        $(id).addClass('error');
      }
      
      if($('#apartment_title').val().length === 0 || $('#apartment_title').hasClass('placeholder')) {
        error('#apartment_title', 'Title missing.');
      }
      if($('#apartment_title').val().length > 40) {
        error('#apartment_title', 'Title can only be 40 characters long. Be creative!');
      }
      if($('#apartment_description').val().length === 0) {
        error('#apartment_description', 'Description missing.');
      }
      if($('#apartment_description').val().length > 140) {
        error('#apartment_description', 'Description can only be 140 characters long. Be creative!');
      }
      if($('#apartment_street').val().length === 0) { error('#apartment_street', 'Street missing.'); }
      if($('#apartment_size').val().length === 0) { error('#apartment_size', 'Size missing.'); }
      if($('#apartment_price').val().length === 0) { error('#apartment_price', 'Price missing.'); }
      if($('#apartment_email').val().length === 0 && $('#apartment_phone').val().length === 0) {
        error('#apartment_email', 'Please provide either an email or a phone number.');
      }
      var files = $('#apartment_photos').attr('files');
      if(files.length === 0) {
        error('#apartment_photos', 'You need to provide at least one photo.');
      } else {
        for(var i = 0; i < files.length; i++) {
          if(!files.item(i).type.match(/image/)) {
            error('#apartment_photos', 'You can only upload photos.');
          }
        }
      }
      
      if(errors.length > 0) {
        var errors_ul = $('#new_apartment #errors');
        errors_ul.html('');
        errors.forEach(function(error) {
          errors_ul.append('<li>' + error.msg + '</li>');
        });
        errors_ul.show();
      }
      
      return errors.length === 0;
    }
  });
  
  $("#big_add_link, .cancel_link").click(function () {
    $("#top_slider").slideToggle("slow");
    return false;
  });
  
  w4lls.hide_filters = function(filters) {
    var left = '-' + filters.find('ul').css('width');
    filters.animate({left: left});
    filters.addClass('hidden');    
  };
  
  w4lls.show_filters = function(filters) {
    filters.removeClass('hidden');
    filters.animate({left: '-3px'});    
  };
  
  $('#filters .view_indicator').click(function() {
    filters = $('#filters');
    if(filters.hasClass('hidden')) {
      w4lls.show_filters(filters);
    } else {
      w4lls.hide_filters(filters);
    }
    return false;
  });

  w4lls.delete_bookmark = function(apartment, bookmark) {
    var bookmarks = $.jStorage.get("w4lls.apartments", []),
      index = bookmarks.indexOf(apartment);
    if(index >= 0) {
      bookmarks.splice(index, 1);
    }
    $.jStorage.set("w4lls.apartments", bookmarks);
    $(bookmark).parents('.bookmark:first').remove();
    if(bookmarks.length === 0) {
      $('#bookmarks_container').hide();
    }
  };
  
  w4lls.add_bookmark = function(apartment) {
    $('#details_container .remember_this').replaceWith($('<p>Already bookmarked</p>'));
    
    var remembered_apartments = $.jStorage.get("w4lls.apartments", []);
    remembered_apartments.push(apartment);
    $.jStorage.set("w4lls.apartments", remembered_apartments);
    
    w4lls.template('show', 'bookmarks', function() {
      $('#bookmarks').append(Mustache.to_html(w4lls.show_template, apartment));
      
      var bookmark = $('#bookmarks .bookmark:last');
      var number = remembered_apartments.length;
      
      bookmark.addClass('jcarousel-item jcarousel-item-horizontal')
              .addClass(' jcarousel-item-' + number + ' jcarousel-item-' + number + '-horizontal')
              .attr('jcarouselindex', number);
              
      bookmark.find('a.details').click(function() {
        location.hash = '/apartments/' + apartment._id;
      });
      
      bookmark.find('a.delete_bookmark').click(function(evt) {
        w4lls.delete_bookmark(apartment, this);
        evt.stopPropagation();
        evt.preventDefault();
      });
      
      if(remembered_apartments.length === 1) {
        $("#bookmarks").jcarousel();
        $('#bookmarks').show();
        $('#bookmarks_container').show();
      }
    });
  };
  
  $(window).resize(function() {
    var map = $('#map'),
      filters = $('#filters'),
      details_container = $('#details_container'),
      map_height = $(window).height() - $("#header").height() - $("#footer").height() - $("#bookmarks").height(),
      filter_height = filters.height();
      
    map.height(map_height);
    filters.css('margin-top', (map_height - parseInt(filters.css('height'), 10)) / 2);
    details_container.css('margin-top', 24).css('height', map_height - 48);
  });
  $(window).trigger("resize");
  
  setTimeout(function() {
    // TODO: chrome somehow cannot calculate the height correctly
    var filters = $('#filters');
    filters.find('.view_indicator').css('height', filters.find('ul').css('height'));    
  }, 750);
  
  var details_container = $('#details_container');
  var width = details_container.css('width');
  details_container.css('right', '-2000px');
  w4lls.show_details = function(apartment, callback) {
    var show_big_details = function() {
      var filters = $('#filters'),
        details_container = $('#details_container'),
        width = details_container.css('width');

      apartment.has_phone = function() { return apartment.phone != undefined; }
      apartment.has_email = function() { return apartment.email != undefined; }

      details_container.html(Mustache.to_html(w4lls.big_details_template, apartment));
      w4lls.hide_filters(filters);
      details_container.css('right', '-' + width);
      var height = parseInt(details_container.css('height'), 10);
      details_container.find('.view_indicator').css('height', height + 24);
      details_container.animate({right: '-3px'});

      w4lls.close_details_container = function() {
        location.hash = '';
        w4lls.show_filters(filters);
        details_container.animate({right: '-' + width});
        setTimeout(function() {
          details_container.css('right', '-2000px');
        }, 500);
        details_container.unbind('click');
      }
      details_container.click(w4lls.close_details_container);
      details_container.find('.view_indicator').click(function(evt) {
        w4lls.close_details_container();
        evt.preventDefault();
        evt.stopPropagation();
      });
      
      var bookmarks = $.jStorage.get("w4lls.apartments", []);
      
      if(!_(bookmarks).detect(function(bookmark) {return bookmark._id == apartment._id;})) {
        details_container.find('.remember_this').click(function(evt) { w4lls.add_bookmark(apartment); evt.stopPropagation(); evt.preventDefault(); });
      } else {
        details_container.find('.remember_this').replaceWith($('<p>Already bookmarked</p>'));
      };
      
      details_container.find('.send_request').click(function(evt) { w4lls.send_request(apartment); evt.stopPropagation(); evt.preventDefault(); });
      
      details_container.find('.facebook_like').replaceWith($('<iframe src="http://www.facebook.com/plugins/like.php?href=' + encodeURIComponent(location.href) + '&amp;layout=standard&amp;show_faces=false&amp;width=450&amp;action=like&amp;colorscheme=light&amp;height=35" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:35px;" allowTransparency="true"></iframe>'));
      
      if(callback) {
        callback(apartment);  
      };
      
    };
    
    w4lls.template('big_details', 'apartments', show_big_details);
  };
  
  w4lls.template = function(template, path, callback) {
    if(w4lls[template + '_template']) {
      callback();
    } else {
      $.get('/views/' + path + '/' + template + '.mustache', function(_template) {
        w4lls[template + '_template'] = _template;
        callback();
      });
    }
  };
  
  w4lls.send_request = function(apartment) {
    var details_container = $('#details_container'),
      contact_request = details_container.find('#contact_request');
    
    contact_request.find('.close_request').click(function(evt) {
      contact_request.hide();
      details_container.find('#details').show();
      details_container.click(w4lls.close_details_container);
      contact_request.find('.close_request').unbind('click');
      evt.stopPropagation();
    });
    
    contact_request.find('form').ajaxForm({
      success: function() {
        contact_request.hide();
        contact_request.find('.close_request').unbind('click');
        details_container.click(w4lls.close_details_container);
        var details = details_container.find('#details');
        details.show();
        details.append('<div class="success">Your request was sent successfully.</div>');
        details.find('.success').delay('4000').fadeOut(function() { $(this).remove(); });
      }
    });
    
    details_container.unbind('click');
    
    details_container.find('#details').hide();
    contact_request.show();
  };
  
  // fix for HTML5 placeholder
  $('[placeholder]').focus(function() {
    var input = $(this);
    if (input.val() == input.attr('placeholder')) {
      input.val('');
      input.removeClass('placeholder');
    }
  }).blur(function() {
    var input = $(this);
    if (input.val() == '') {
      input.addClass('placeholder');
      input.val(input.attr('placeholder'));
    }
  }).blur();
  
  $('[placeholder]').parents('form').submit(function() {
    $(this).find('[placeholder]').each(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
      }
    })
  });
});