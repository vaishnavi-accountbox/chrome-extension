var _EB_Cookie = {

	get_cookie_value : function(url, cookieName, callback) {

		try {
			chrome.cookies.get({
				url : url,
				name : cookieName
			}, function(cookie) {

				if (callback)
					callback(cookie);

			});
		} catch (e) {
			if (callback)
				callback(undefined);
		}

	},
	set_cookie_value : function(url, cookieName, cookieValue, callback) {

		try {

			chrome.cookies.set({
				url : url,
				name : cookieName,
				value : cookieValue
			}, function(cookie) {

				if (callback)
					callback(cookie);

			});
		} catch (e) {
			if (callback)
				callback(undefined);
		}

	},

	remove_cookie : function(url, cookieName, callback) {

		try {

			chrome.cookies.remove({
				url : url,
				name : cookieName
			}, function(cookie) {

				if (callback)
					callback(cookie);

			});
		} catch (e) {
			if (callback)
				callback(undefined);
		}

	}
}
