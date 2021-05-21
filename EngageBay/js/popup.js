'use strict';

var _EB_Popup = {

	init : function() {

		_EB_storage.get_local_storage(AUTH_USER_API_KEY_NAME,
				function(authUser) {

					if (!authUser) {
						
						_EB_storage.get_local_storage(
								"POPUP_DEFAULT_TEMPLATE", function(data) {
									
									if(data && data.template_name){
										$("#popupContent").html(
												EngageBaygetTemplate(data.template_name, data.data));
										
										_EB_storage.set_local_storage(
												"POPUP_DEFAULT_TEMPLATE", data, function() {
												});
										
									}else{
										$("#popupContent").html(
												EngageBaygetTemplate('welcome', {}));
									}
									
								});
						
					} else {
						ENGAGEBAY_AUTH_USER_DATA = authUser;
						_EB_Popup.loadUserDashboard(authUser);
					}
				});

	},

	loadUserDashboard : function(authUser) {

		$("#popupContent").html(EngageBaygetTemplate('navbar', {}));

		chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tb) {

		    if (tb[0] != undefined && (tb[0].url.indexOf('www.linkedin.com/in') != -1 || tb[0].url.indexOf('www.linkedin.com/profile') != -1 || tb[0].url.indexOf('www.linkedin.com/comm/profile') != -1 || tb[0].url.indexOf('www.linkedin.com/company') != -1)) {
				fetchLinkedInData(tb[0]);
			}
			else if (tb[0] != undefined && tb[0].url.indexOf('twitter.com') != -1) {
					
					if (tb[0].url.indexOf('/members') != -1) {
						fetchTwitterDataMultiple(tb[0]);
					} else {
						var twturlCheck = tb[0].url;
						var twturlCheckLenght1 = twturlCheck.indexOf("/search?u");
						var twturlCheckLenght2 = twturlCheck.indexOf("/search?");
						if (tb[0].url.length >= 22 && twturlCheckLenght1 < 5) {
							if(twturlCheckLenght2 < 5){
								fetchTwitterData(tb[0]);
							} else {
							$('body').find('#loadActivities').trigger('click');
						}
							
						} else {
							$('body').find('#loadActivities').trigger('click');
						}

			}
			}
			else{
				$('body').find('#loadActivities').trigger('click');
			}
		});
	}
};

function fetchTwitterData(tab){
	$('.navbar').find('.options.active').removeClass(
						'active');
	$("#popupContent #dashbordContent")
			.html(
					'<div class="text-center xs-pt-50 xs-mt-40"><img height="100" width="100" src="../images/loader.gif"></div>');

	$("#popupContent #dashbordContent").html(EngageBaygetTemplate('twitter-fetch-active',
							{tabId: tab.id}));
}

function fetchTwitterDataMultiple(tab){
	$('.navbar').find('.options.active').removeClass(
						'active');
	$("#popupContent #dashbordContent")
			.html(
					'<div class="text-center xs-pt-50 xs-mt-40"><img height="100" width="100" src="../images/loader.gif"></div>');

	$("#popupContent #dashbordContent").html(EngageBaygetTemplate('twitter-multiple-fetch-active',
							{tabId: tab.id}));
}


function fetchLinkedInData(tab){
	$('.navbar').find('.options.active').removeClass(
						'active');
	$("#popupContent #dashbordContent")
			.html(
					'<div class="text-center xs-pt-50 xs-mt-40"><img height="100" width="100" src="../images/loader.gif"></div>');

	$("#popupContent #dashbordContent").html(EngageBaygetTemplate('linkedin-fetch-active',
							{tabId: tab.id}));
}

(function() {

	head
			.js(
					'https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js',
					'https://d2p078bqz5urf7.cloudfront.net/cloud/assets/js/handlebars.min.js',
					'../js/lib/jquery.validate.min.js',
					'../js/lib/bootstrap.min.js',
					'../js/lib/bootstrap-select.js',
					'../js/lib/bootstrap-datepicker.js',
					'../js/engagebay-content-country-code.js',
					'../js/commons.js',
					'../js/popup-events.js',
					'../js/auth.js',
					'../js/lib/timeago.js',
					'../js/lib/md5.js',
					function() {
						_EB_Popup_Events.initialize_listeners();
						_EB_Popup.init();

						Handlebars.registerHelper("getPropertyValue", function(
								properties, key, options) {
							return getPropertyValue(properties, key);
						});

						Handlebars.registerHelper('checkrecipientsCount',
								function(info, count, options) {

									var recipients = getPropertyValue(info,
											'recipients');
									try {

										recipients = JSON.parse(recipients);

										if (!recipients
												|| recipients.length == 0)
											return options.inverse(this);

										if (recipients.length == count)
											return options.fn(this);

									} catch (e) {
									}

									return options.inverse(this);

								});

						Handlebars.registerHelper('getrecipients', function(
								info, options) {

							var recipients = getPropertyValue(info,
									'recipients');
							try {

								recipients = JSON.parse(recipients);

								if (!recipients || recipients.length == 0)
									return "";

							} catch (e) {
								return "";
							}

							var rec = [];
							$.each(recipients, function(index, val) {
								rec.push(val.name + "<" + val.emailAddress
										+ ">");
							});

							return rec.join(", ");

						});

						Handlebars.registerHelper("countrycode", function (country) {

							return getCountryOptions(country)
						});

						Handlebars.registerHelper('getFirstRecipientDetails',
								function(key, info, options) {

									var recipients = getPropertyValue(info,
											'recipients');

									try {
										recipients = JSON.parse(recipients);
									} catch (e) {
									}

									return recipients[0][key];

								});

						Handlebars.registerHelper('getRecipientName', function(
								info, options) {

							var recipients = getPropertyValue(info,
									'recipients');

							try {

								recipients = JSON.parse(recipients);

								if (!recipients || recipients.length == 0)
									return "Someone";

							} catch (e) {
								return "Someone";
							}

							if (recipients.length > 1)
								return "Someone";

							var name = recipients[0].name;
							if (!name || name === null)
								name = recipients[0].emailAddress
										.match(/^([^@]*)@/)[1];

							return name + "<" + recipients[0].emailAddress
									+ ">";

						});

						Handlebars
								.registerHelper(
										'getEmailGravatarURL',
										function(acivity, options) {

											var img = "https://d2p078bqz5urf7.cloudfront.net/cloud/assets/img/default-avatar.gif";

											var recipients = getPropertyValue(
													acivity.info, 'recipients');

											try {
												recipients = JSON
														.parse(recipients);
												if (!recipients
														|| recipients.length == 0)
													return img;

											} catch (e) {
												return img;
											}

											var backup_image = "&d=" + img
													+ "\" ";
											var email = recipients[0].emailAddress;

											if (email) {
												return new Handlebars.SafeString(
														'https://secure.gravatar.com/avatar/'
																+ MD5(email)
																+ '.jpg?s='
																+ "50"
																+ backup_image);
											}

											return new Handlebars.SafeString(
													'https://secure.gravatar.com/avatar/'
															+ MD5("")
															+ '.jpg?s=' + "50"
															+ backup_image);

										});

						// To compare values
						Handlebars
								.registerHelper(
										'getUserProfileImg',
										function(options) {

											if (ENGAGEBAY_AUTH_USER_DATA['profile_img_url'])
												return ENGAGEBAY_AUTH_USER_DATA['profile_img_url'];

											return "https://d2p078bqz5urf7.cloudfront.net/cloud/assets/img/avatar/avatar.png";

										});

						// To compare values
						Handlebars
								.registerHelper(
										'getActivityEntityDetails',
										function(activity, entityName, key,
												options) {
											if (!activity
													|| !activity.entity_list
													|| activity.entity_list.length == 0)
												return "";

											var val = "";
											$
													.each(
															activity.entity_list,
															function(index,
																	json) {
																try {
																	if (entityName == json.entity_type) {
																		val = json.entity[key];
																	}
																} catch (e) {
																}

															});

											return val;

										});

						Handlebars.registerHelper('getActivityInfo', function(
								info, key, options) {

							var propVal = getPropertyValue(info, key);

							if (!propVal && key == "subject")
								propVal = "(no subject)";

							return propVal;
						});

						Handlebars.registerHelper('getActivityMiscInfo',
								function(miscInfo, key, options) {

									try {
										return JSON.parse(miscInfo)[key];
									} catch (e) {
									}

									return "";
								});

						// Gets timeago from date
						Handlebars.registerHelper('timeAgo', function(time) {
							return jQuery.timeago(time * 1000);
						});

					});

})();

function getWebsiteFromEmail(email) {

	try {
		var emailArray = email.split("@");
		return emailArray[1];
	} catch (e) {
		// TODO: handle exception
	}
}

function isEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,5})+$/;
	return regex.test(email);
}
