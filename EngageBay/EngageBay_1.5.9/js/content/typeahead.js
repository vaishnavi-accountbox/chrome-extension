var TYPEAHEAD_AJAX_XHR = {};
function engageBayTypeAhead($ele, callback, moreOptions) {

	var url = "";
	var searchOn = $ele.attr('data-search');
	switch (searchOn) {
	case "CONTACT":
		url = "/api/search?type=Subscriber";
		break;
	case "TAG":
		url = "/api/panel/tags";
		break;
	case "COMPANY":
		url = "/api/search?type=Company";
		break;
	case "DEAL":
		url = "/api/search?type=Deal";
		break;
	default:
		break;
	}

	if (!url)
		return;

	$ele.typeahead({
		minLength : 1,
		displayText : function(obj) {

			if (obj && obj.name)
				return obj.name;

			if (obj && obj.tag)
				return obj.tag;

		},
		updater : function(item) {

			// Check if tag is already exist
			var id = item.id;
			if (item.entiy_group_name == "tag")
				id = item.tag;

			var isMatchFound = false;
			$ele.siblings('.typeahead-list-container').find('ul li').each(function() {
				if ($(this).attr('data') == id)
					isMatchFound = true;
			})

			if (isMatchFound)
				return '';

			$ele.siblings('.typeahead-list-container').find('ul').append(
					EngageBayGetAndCompileTemplate("tag-item-li", item));

			return '';
		},
		source : function(query, result) {

			try {
				if (TYPEAHEAD_AJAX_XHR[searchOn.toLowerCase()])
					TYPEAHEAD_AJAX_XHR[searchOn.toLowerCase()].abort();
			} catch (e) {
			}

			TYPEAHEAD_AJAX_XHR[searchOn.toLowerCase()] = _EB_Request_Processor(
					url, {
						'q' : query,
						'page_size' : 10,
					}, "GET", function(data) {

						result($.map(data, function(item) {
							item.entiy_group_name = searchOn.toLowerCase();
							return item;
						}));

					}, undefined, undefined);
			
			/*
			 * $.ajax({ url : url, data : { 'q' : query, 'page_size' : 10,
			 * 'apiKey' : ENGAGEBAY_AUTH_USER_DATA.api_key.js_API_Key },
			 * dataType : "json", type : "GET", success : function(data) {
			 * result($.map(data, function(item) { item.entiy_group_name =
			 * searchOn.toLowerCase(); return item; })); } });
			 */
		},
		 
		 // Needs to be overridden to set timedelay on search
						keyup : function(e) {
							switch (e.keyCode) {
							case 40: // down arrow
							case 38: // up arrow
							case 16: // shift
							case 17: // ctrl
							case 18: // alt
								break

							case 9: // tab
							case 13: // enter


									this.select();
								break

							case 27: // escape
								if (!this.shown)
									return
									
								this.hide()
								break

							case 188:
								break

							default: {
								// Checks if there is previous request and
								// cancels it
								if (TYPEAHEAD_AJAX_XHR[searchOn.toLowerCase()] != null
										&& (TYPEAHEAD_AJAX_XHR[searchOn.toLowerCase()] && TYPEAHEAD_AJAX_XHR[searchOn.toLowerCase()] != 4)) {
									TYPEAHEAD_AJAX_XHR[searchOn.toLowerCase()].abort();
								}

								if (this.timer)
									clearTimeout(this.timer);
								var self = this;

								this.timer = setTimeout(function() {
									self.lookup();
								}, this.options.timedelay);
							}
							}

							e.stopPropagation()
							e.preventDefault()
						}


	});

}
