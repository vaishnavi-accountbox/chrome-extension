'use strict';

var BROWSER_NOTIFICATION_PERMISSION_LEVEL = "";
var ENGAGEBAY_EXTENSION_TAB_IDS = {};

function reloadGmailTabs() {

	// console.log("reloadGmailTabs");

	// Else (install)
	browser.tabs.query({
		url: ["https://mail.google.com/*", "https://inbox.google.com/*",
			"https://outlook.live.com/*", "https://outlook.office.com/*",
			"https://outlook.office365.com/*"]
	}, function (tabs) {

		for (var i = 0; i < tabs.length; i++) {

			browser.tabs.reload(tabs[i].id, {}, function () {

			});
		}

	});

}

function getServerPath(domainName) {
	// return "http://localhost:8888";
	return "https://" + domainName + ".engagebay.com";
}

function checkLoginAndDoNessasaryActions() {

	_EB_storage.get_local_storage(AUTH_USER_API_KEY_NAME, function (authUser) {

		// console.log("Auth Info", authUser);

		// If auth not available retur
		if (!authUser || !Object.keys(authUser).length || !authUser.domain_name
			|| !authUser.api_key) {
			return;
		}
		ENGAGEBAY_AUTH_USER_DATA = authUser;

		// console.log("connecting to channel ", ENGAGEBAY_AUTH_USER_DATA.id);

		connectToChannel(ENGAGEBAY_AUTH_USER_DATA.id)
	});
}

var _EB_Background = {

	create_notification: function (options) {

		if (!BROWSER_NOTIFICATION_PERMISSION_LEVEL) {
			window.browser.notifications
				.getPermissionLevel(function (grantType) {
					BROWSER_NOTIFICATION_PERMISSION_LEVEL = grantType;
					_EB_Background.show_notification(options);
				});
			return;
		}

		_EB_Background.show_notification(options);

	},

	show_notification: function (options) {

		if (!BROWSER_NOTIFICATION_PERMISSION_LEVEL
			|| BROWSER_NOTIFICATION_PERMISSION_LEVEL != "granted")
			return;

		var notyId = "noty_id_" + new Date().getTime();
		window.browser.notifications.create(notyId, {
			'title': options.title,
			'message': options.body,
			'type': 'basic',
			'iconUrl': '/images/notification.png'
		});

		_EB_Background.setBadgeText("!!!!");

		setTimeout(function () {
			window.browser.notifications.clear(notyId);
		}, 10000);

	},

	setIcon: function (path) {

		if (!path)
			return;

		browser.browserAction.setIcon({
			path: {
				'16': '../images/' + path + "_16.png",
				'32': '../images/' + path + "_32.png"
			}

		});

	},

	setBadgeText: function (text) {

		text = (!text) ? "" : text;

		browser.browserAction.setBadgeText({
			text: text
		});
	},

	setBadgeBackgroundColor: function (color) {

		if (!color)
			return;

		browser.browserAction.setBadgeBackgroundColor({
			color: color
		});

	},

	create_tab: function (url) {

		if (!url)
			return;

		browser.tabs.create({
			url: url
		});
	},
	logoutUser: function (callback) {
		_EB_storage.remove_local_storage(AUTH_USER_API_KEY_NAME, function () {
			_EB_Background.setIcon('offline_icon');
			reloadGmailTabs();
			if (callback)
				callback();
		});
	},

	reloadEngagebayTabs: function () {

		// Else (install)
		chrome.tabs.query({
			url: "*://*.engagebay.com/*"
		}, function (tabs) {

			for (var i = 0; i < tabs.length; i++) {

				if ((tabs[i].url).indexOf("www.engagebay.com") != -1)
					continue;

				chrome.tabs.reload(tabs[i].id, {}, function () {

				});
			}

		});

	},
};

$(function () {

	checkLoginAndDoNessasaryActions();

	browser.runtime.onInstalled.addListener(function (details) {

		if (details.reason == "update") {
			var thisVersion = chrome.runtime.getManifest().version;
			console.log("Updated from " + details.previousVersion + " to "
				+ thisVersion + "!");
		}

		reloadGmailTabs();

		// Relaod agent dashboard tabs
		_EB_Background.reloadEngagebayTabs();

	});

	browser.management.onDisabled.addListener(function (ExtensionInfo) {
		reloadGmailTabs();
	});

	browser.runtime.onMessage
		.addListener(function (request, sender, sendResponse) {

			if (request.event == 'content_scripts_loaded') {
				// Loaded in tabs

				_EB_Cookie
					.get_cookie_value(
						"https://mail.google.com",
						"ENGAGEBAY_GMAIL_LOGGED_IN_USERS",
						function (cookieDetails) {

							var cookie = (!cookieDetails || !cookieDetails.value) ? undefined
								: cookieDetails.value;

							if (cookie)
								cookie = JSON.parse(cookie);
							else
								cookie = [];

							cookie
								.push(request.logged_in_user_email);

							cookie = $.unique(cookie);

							_EB_Cookie
								.set_cookie_value(
									"https://mail.google.com",
									"ENGAGEBAY_GMAIL_LOGGED_IN_USERS",
									JSON.stringify(cookie));

						});

			} else if (request.event == 'get_tab_url') {
				console.log('tab', sender.tab.url);
				sendResponse({
					url: sender.tab.url
				});
			} else if (request.event == 'contact_dialog') {
				request.data.countrycode = countryCode2Name;
				var html = getHTML(request.template, request.data);
				// console.log('Sending html content.');
				sendResponse({
					dialog: html
				});
			} else if (request.event == 'contact_form') {
				var html = getHTML(request.template, '');
				// console.log('Sending html content.');
				sendResponse({
					dialog: html
				});
			}

			else if (request.event == 'post_message_to_tab') {

				chrome.tabs.sendMessage(request.tab_id, {
					action: request.data.action,
					data: request.data
				}, function (response) {

				});
			}

			else if (request.event == 'tab_created_by_extension') {
				console.log('tab', ENGAGEBAY_EXTENSION_TAB_IDS);
				sendResponse({
					status: ENGAGEBAY_EXTENSION_TAB_IDS[sender.tab.id],
					id: sender.tab.id,
					parent_id: ENGAGEBAY_EXTENSION_TAB_IDS[sender.tab.id]
				});
			}

			else if (request.event == 'close_tab') {

				browser.tabs.remove(request.tab_id, function () {
					console.log('request', request);
				});
			}

			else if (request.event == 'open_new_popup_tab') {

				browser.tabs.create({
					url: request.link,
					active: false,
					openerTabId: sender.tab.id
				}, function (tab) {
					ENGAGEBAY_EXTENSION_TAB_IDS[tab.id] = sender.tab.id;
					// After the tab has been created, open a window to
					// inject the tab
					browser.windows.create({
						tabId: tab.id,
						type: 'popup',
						focused: true,
						width: 470,
						height: 600
					});
				});

			}

		});

	// chrome.webRequest.onBeforeRequest.addListener(function(e) {
	// try {
	// for (var t = localStorage.getItem("email_ids"), i = t ? JSON
	// .parse(t) : [], r = i.length; r--;)
	// for ( var a in LOCATION_TRACKERS_V)
	// if (~e.url.indexOf(LOCATION_TRACKERS_V[a] + "?u=" + i[r]
	// + "&"))
	// return {
	// redirectUrl : "javascript:"
	// }
	// } catch (i) {
	// Error_report(850, i)
	// }
	// if (DEBUG && ~e.url.indexOf("googleusercontent.com")
	// && ~e.url.indexOf("#"))
	// for ( var n in LOCATION_TRACKERS_V)
	// if (0 === e.url.split("#", 2)[1]
	// .indexOf(LOCATION_TRACKERS_V[n]))
	// return {
	// redirectUrl : e.url.split("#", 2)[1]
	// }
	// }, {
	// urls : [ "*://*.googleusercontent.com/*" ]
	// .concat(window.LOCATION_TRACKERS.map(function(e) {
	// return e + "*"
	// }))
	// }, [ "blocking" ]);

	// To stop tracking the email sent when the sender opened it.
	browser.webRequest.onBeforeRequest.addListener(function (details) {

		try {

			if (details.type != "image") {
				return {
					cancel: false
				};
			}

			var state = false;

			var url = "https://one.ebext.in/openmail";
			var urlOld = "https://ebext.in/openmail";
			// var urlOld = "https://ehhub.org/openmail";

			if ((details.url.indexOf(url) > -1 && details.url.indexOf(url
				+ "?f=true") == -1)
				|| (details.url.indexOf(urlOld) > -1 && details.url
					.indexOf(urlOld + "?f=true") == -1))
				state = true;

			return {
				cancel: state
			};

		} catch (err) {
			console.log(err);
			return '';
		}
	}, {
		urls: ["*://*.googleusercontent.com/*", "*://*.eblink6.com/*",
			"*://*.ehhub.org/*", "*://eblink6.com/*", "*://ehhub.org/*", "*://ebext.in/*", "*://*.ebext.in/*",]
	}, ["blocking"]);

	browser.notifications.onPermissionLevelChanged.addListener(function (
		permissionLevel) {
		BROWSER_NOTIFICATION_PERMISSION_LEVEL = permissionLevel;
	});

	browser.webRequest.onHeadersReceived.addListener(function (details) {
		var stripHeaders = ['content-security-policy', 'x-frame-options',];
		return {
			responseHeaders: details.responseHeaders.filter(function (header) {
				return stripHeaders.indexOf(header.name.toLowerCase()) < 0;
			})
		};
	}, {
		urls: ["https://*.engagebay.com/*", "http://localhost:8888/*",
			"https://*.linkedin.com/*"]
	}, ["blocking", "responseHeaders"]);

	var requestHeaderss = false;
	chrome.tabs.onCreated.addListener(function () {
		requestHeaderss = false;
		chrome.tabs.query({
			// 'active' : true,
			'windowId': chrome.windows.WINDOW_ID_CURRENT
		}, function (tabs) {
			if (tabs[0]) {
				var taburl = tabs[0].url;
				if (taburl
					&& (taburl.indexOf("localhost") > -1 || taburl
						.indexOf("engagebay") > -1)) {
					requestHeaderss = true;
				} else {
					if (taburl && taburl.indexOf("linkedin") > -1) {
						requestHeaderss = false;
					}
				}
			}
		});
	});
	chrome.webRequest.onBeforeSendHeaders
		.addListener(
			function (details) {
				chrome.tabs
					.query(
						{
							'active': true,
							'windowId': chrome.windows.WINDOW_ID_CURRENT
						},
						function (tabs) {
							if (tabs[0]) {
								var taburl = tabs[0].url;
								if (taburl
									&& (taburl
										.indexOf("localhost") > -1 || taburl
											.indexOf("engagebay") > -1)) {
									requestHeaderss = true;
								} else {
									if (taburl
										&& taburl
											.indexOf("linkedin") > -1) {
										requestHeaderss = false;
									}
								}
							}
						});
				if (requestHeaderss) {
					for (var i = 0, l = details.requestHeaders.length; i < l; ++i) {
						if (details.requestHeaders[i].name === 'User-Agent') {
							details.requestHeaders[i].value = "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19";
							break;
						}
					}
					return {
						requestHeaders: details.requestHeaders
					};
				}
			}, {
			urls: ["https://*.linkedin.com/*"]
		}, ["blocking", "requestHeaders"]);

});