'use strict';

var AUTH_USER_API_KEY_NAME = "auth_user_api_key";
var ENGAGEBAY_SENT_EMAIL_THREAD_ID_LIST = "sent_email_thread_id_list";
var ENGAGEBAY_AUTH_USER_DATA;

// Fortunately, most of the API remains the same behind the browser. So, it’s
// very simple to create a little trick to support all browsers
window.browser = (function() {
	return window.msBrowser || window.browser || window.chrome;
})();

function getEngageBayDomainPath(domainName) {

	return "https://" + domainName + ".engagebay.com";

	//return "https://" + domainName + "-dot-74-2-dot-accountbox-154605.appspot.com";

	//return "https://9162b6fc76a2.ngrok.io";

	// return "http://localhost:8888";

}

var _EB_storage = {

	get_local_storage : function(key, callback) {

		browser.storage.local.get(function(item) {

			var storage = undefined;

			if (item[key])
				storage = item[key];

			if (callback)
				callback(storage);
		});
	},

	get_complete_local_storage : function(callback) {

		browser.storage.local.get(function(item) {

			if (callback)
				callback(item);

		});
	},

	set_local_storage : function(key, json, callback) {

		var storage = {};
		storage[key] = json;

		browser.storage.local.set(storage, function() {
			if (callback)
				callback();
		});
	},

	remove_local_storage : function(key, callback) {

		browser.storage.local.remove(key, function() {
			if (callback)
				callback();
		});
	}

}

function _EB_Request_Processor(url, json, type, callback, errorCallback,
		contentType, prefix) {

	if (url.trim().indexOf("http") == 0) {
		return _EB_Send_AJAX(url, json, type, callback, errorCallback)
	} else {

		if (prefix) {
			url = prefix + url;
		} else {
			url = "/rest/js" + url;
		}

		if (ENGAGEBAY_AUTH_USER_DATA && ENGAGEBAY_AUTH_USER_DATA.domain_name) {
			json['apiKey'] = ENGAGEBAY_AUTH_USER_DATA.api_key.js_API_Key;
			return _EB_Send_AJAX(
					getEngageBayDomainPath(ENGAGEBAY_AUTH_USER_DATA.domain_name)
							+ url, json, type, callback, errorCallback,
					contentType);
		}

		_EB_storage.get_local_storage(AUTH_USER_API_KEY_NAME,
				function(authUser) {

					if (!authUser || !Object.keys(authUser).length
							|| !authUser.domain_name || !authUser.api_key) {
						errorCallback("Unauthenticated");
					} else {
						json['apiKey'] = authUser.api_key.js_API_Key;

						return _EB_Send_AJAX(
								getEngageBayDomainPath(authUser.domain_name)
										+ url, json, type, callback,
								errorCallback, contentType);
					}

				});

	}

}

function _EB_Send_AJAX(url, json, type, callback, errorCallback, contentType) {

	var datatypeis = "json";
	if (url.indexOf("/api/browser-extension/predesigned?name=") > 0) {
		datatypeis = "text";
	}

	if ((type == "POST" || type == "PUT") && contentType == "application/json") {
		url += "?apiKey=" + json['apiKey'];
		json = JSON.stringify(json);
	}

	var json = {
		type : type,
		data : json,
		// contentType: 'application/json',
		url : url,
		success : function(data) {
			if (callback)
				callback(data);
		},
		error : function(error, exception) {
			
			console.log('exception', exception);

			console.warn(error);

			if (error.status === 200) {
				if (callback)
					callback({});

				return;
			}

			// Remove session when keys reset
			if (error.status === 401) {

				try {
					browser.extension.getBackgroundPage()._EB_Background
							.logoutUser(function() {

							});
				} catch (e) {
				}

			}
			if (errorCallback) {
				errorCallback(error);
				return;
			}

		}

	};

	if (contentType)
		json.contentType = contentType;

	if (datatypeis)
		json.dataType = datatypeis;

	// Ajax call to process requests
	return $.ajax(json);
}

function EngageBaygetTemplate(templateName, context) {

	_EB_storage.remove_local_storage("POPUP_DEFAULT_TEMPLATE");

	templateName = (templateName.indexOf("-template") == -1) ? templateName
			+ "-template" : templateName;

	var source = $('#' + templateName).html();
	if (!source)
		return null;

	return EngageBayCompileTemplate(source, context);

}

function EngageBayCompileTemplate(source, context) {

	if (!source)
		return null;

	var template = Handlebars.compile(source);
	return template(context);

}

try {

	// To compare values
	Handlebars.registerHelper('getAuthDetails', function(key, options) {

		try {
			return ENGAGEBAY_AUTH_USER_DATA[key];
		} catch (e) {
		}

		return "";

	});

	// To compare values
	Handlebars.registerHelper('getNameFromEmail', function(str, options) {
		try {
			return str.match(/^([^@]*)@/)[1];
		} catch (e) {
		}
		return str;
	});

	// To compare values
	Handlebars.registerHelper('getImageURL', function(path, options) {
		return browser.extension.getURL(path);
	});

	// To compare values
	Handlebars.registerHelper('equal', function(value, target, options) {
		if (value || value == 0)
			value = value.toString();

		if (value != target)
			return options.inverse(this);
		else
			return options.fn(this);
	});

	Handlebars.registerHelper('getFileSize', function(size, options) {
		if (!size)
			return 0 + "Bytes";

		if (size < 1024)
			return size + " Bytes";
		else if (size < 1024 * 1024)
			return trim_file_size(size / 1024) + " KB";
		else
			return trim_file_size(size / (1024 * 1024)) + " MB";
	});

	// Gets timeago from date
	Handlebars.registerHelper('getFormattedTime', function(ctx) {
		if (ctx / 100000000000 < 1)
			ctx = ctx * 1000;
		var tm = new Date(ctx); // millisec

		return tm.toDateString() + " " + tm.toLocaleTimeString();
	});

	// Gets timeago from date
	Handlebars.registerHelper('encodeURL', function(url, options) {
		return encodeURIComponent(url);
	});

	// Gets timeago from date
	Handlebars.registerHelper('escapeCharsInFieldName',
			function(text, options) {
				if (!text)
					return "";

				text = text.replace(/_/g, ' ');

				return text;
			});

	Handlebars.registerHelper('decodeValue', function(value, options) {
		try {
			if (value) {
				return decodeURIComponent(value);
			}
			return value;
		} catch (e) {
			return value;
		}

	});

	/**
	 * Helper function to return date string from epoch time
	 */
	Handlebars.registerHelper('epochToHumanDate', function(date, format,
			options) {

		if (!date)
			return "--";

		if (!format)
			format = "MMMM Do YYYY, h:mm:ss a";

		return epochToHumanDateFromUserTZ(date, format);

	});

	var AB_TEMP_NUM = 0;
	Handlebars.registerHelper('abTempName', function(var1, options) {
		return "ab-temp-" + (++AB_TEMP_NUM);
	});

	Handlebars.registerHelper('format_field_name',
			function(field_name, options) {
				if (field_name) {
					field_name = field_name.trim().split(' ').join('_');
				}
				return field_name;
			});

	// Gets timeago from date
	Handlebars.registerHelper('getGravatarImage', function(email) {
		if (!email)
			email = "";
		// Default image
		const backup_image = "&d=" + 404 + "\" ";

		return 'https://secure.gravatar.com/avatar/' + MD5(email) + '.jpg?s='
				+ "50" + backup_image;
	});

	// To compare values
	Handlebars.registerHelper('ifElementsExist', function(object, options) {
		if (!$.isEmptyObject(object))
			return options.fn(this);
		else
			return options.inverse(this);
	});

	Handlebars.registerHelper('getRandomUniqueNumber', function(obj, key,
			options) {

		obj[key] = Math.floor(Math.random() * 99999999999);
		return options.fn(obj);

	});

	Handlebars.registerHelper('convertToArray',
			function(str, key, obj, options) {

				try {
					obj[key] = str.split(',');
				} catch (e) {
				}
				console.log("obj 1", obj)
				return options.fn(obj);

			});


	Handlebars.registerHelper('checkIsObjStr',
			function(str, options) {

				try {
					JSON.parse(str);
					return options.fn(this);
				} catch (e) {
				}
				
			return options.inverse(this);

			});

Handlebars.registerHelper('parseObj',
			function(key, obj, options) {

				try {
					obj[key] = JSON.parse(obj[key]);
				} catch (e) {
				}
				return options.fn(obj);

			});

}catch (e) {
		}

function trim_file_size(size) {
	return Math.round(size * 100) / 100;
}

function getPropertyValue(items, name) {
	if (items == undefined)
		return;

	for (var i = 0, l = items.length; i < l; i++) {
		if (items[i].name == name) {
			try {
				if (items[i].value != null)
					items[i].value = items[i].value.trim();
			} catch (e) {
				// TODO: handle exception
			}

			return items[i].value;
		}
	}
}

function getIntialImage(name) {

	// Defining Colors
	var colors = [ "#1abc9c", "#16a085", "#f1c40f", "#f39c12", "#2ecc71",
			"#27ae60", "#e67e22", "#d35400", "#3498db", "#2980b9", "#e74c3c",
			"#c0392b", "#9b59b6", "#8e44ad", "#bdc3c7", "#34495e", "#2c3e50",
			"#95a5a6", "#7f8c8d", "#ec87bf", "#d870ad", "#f69785", "#9ba37e",
			"#b49255", "#b49255", "#a94136" ];

	var settings = {
		charCount : 2,
		fontWeight : 'normal',
		name : name,
		textColor : '#ffffff',
		height : 100,
		width : 100,
		fontSize : 40,
		fontWeight : 400,
		fontFamily : 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif'

	}

	// making the text object
	var c = settings.name.substr(0, settings.charCount).toUpperCase();
	var cobj = $('<text text-anchor="middle"></text>').attr({
		'y' : '50%',
		'x' : '50%',
		'dy' : '0.35em',
		'pointer-events' : 'auto',
		'fill' : settings.textColor,
		'font-family' : settings.fontFamily
	}).html(c).css({
		'font-weight' : settings.fontWeight,
		'font-size' : settings.fontSize + 'px',
	});

	var colorIndex = null;
	if (c.length > 1)
		colorIndex = Math.abs(Math.floor((((c.charCodeAt(0) - 65) + (c
				.charCodeAt(1) - 65)) / 2)
				% colors.length));
	else
		colorIndex = Math.abs(Math
				.floor((c.charCodeAt(0) - 65) % colors.length));

	var svg = $('<svg></svg>').attr({
		'xmlns' : 'http://www.w3.org/2000/svg',
		'pointer-events' : 'none',
		'width' : settings.width,
		'height' : settings.height
	}).css({
		'background-color' : colors[colorIndex],
		'width' : settings.width + 'px',
		'height' : settings.height + 'px'
	});

	svg.append(cobj);
	// svg.append(group);
	var svgHtml = window.btoa(unescape(encodeURIComponent($('<div>').append(
			svg.clone()).html())));

	return 'data:image/svg+xml;base64,' + svgHtml;

}

function epochToHumanDateFromUserTZ(epochTimeInSec, format) {

	try {

		if (!epochTimeInSec)
			epochTimeInSec = parseInt(new Date().getTime() / 1000);

		var timeZoneOffset = getUserTimeZoneOffset();
		format = (!format) ? 'MMMM Do YYYY, h:mm:ss a' : format;

		return moment(parseInt(epochTimeInSec * 1000)).utcOffset(
				parseInt(timeZoneOffset)).format(format);

		// With timezone name
		// return moment(new
		// Date().getTime()).tz('America/Los_Angeles').format(format);

		// Without timezone
		// return moment(parseInt(epochTimeInSec * 1000)).format(format);

	} catch (err) {
		console.error("Invalid date for custom field.");
	}

	return;

}