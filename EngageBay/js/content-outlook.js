'use strict';

document.documentElement.setAttribute("data-engagebay-initialized", "1");

var OUTLOOK_SENT_EMAIL_DETAILS = {};

var SERVICE_TYPE = 'live';

(function() {
	
	authenticateUser(function() {
		
		checkAndInitIalizeOutlookTracker();

		initlializeOutllokEngagebayToolkit();

	});

})();

function checkAndInitIalizeOutlookTracker() {

	try {
		SERVICE_TYPE = window.location.host.split(".")[1];
	} catch (e) {
	}

	if ("outlook.live.com" == window.location.host
			&& (0 == window.location.pathname.indexOf("/owa/") || 0 == window.location.pathname
					.indexOf("/mail/"))) {
		initializeOutlookTracker();
		return;
	}

	else if (("outlook.office365.com" == window.location.host)
			&& (0 == window.location.pathname.indexOf("/owa/") || 0 == window.location.pathname
					.indexOf("/mail/"))) {
		initializeOutlookOffice365Tracker();
		return;
	}

	else if (("outlook.office.com" == window.location.host)
			&& (0 == window.location.pathname.indexOf("/owa/") || 0 == window.location.pathname
					.indexOf("/mail/"))) {
		initializeOutlookOfficeTracker();
		return;
	}

}

function getRecipientsFromOutlookComposeView(recipents) {

	var formattedRecipients = [];

	recipents instanceof Array && recipents.forEach(function(e) {
		e.Item && e.Item.ToRecipients && (recipents = e.Item.ToRecipients);
	}), recipents.forEach(function(e) {

		formattedRecipients.push({
			'emailAddress' : e.EmailAddress,
			'name' : e.Name.split("@")[0]
		});

	});

	return formattedRecipients;

}

function getSubjectFromOutlookComposeView(subject) {

	subject instanceof Array && subject.forEach(function(e) {
		e.Item && e.Item.Subject && (subject = e.Item.Subject)
	});

	return subject;

}

function getContentItemFromOutlookComposeView(body) {

	body instanceof Array && body.forEach(function(e) {
		e.Item && e.Item.Body && (body = e.Item.Body)
	});

	return body;
}

function initializeOutlookTracker() {

	injectScript(chrome.extension.getURL("js/outlook2.js"));

	Xtion_request(
			"https://outlook.live.com/owa/0/sessiondata.ashx?app=Mail",
			function(sessionData) {

				var sessionDetails = JSON.parse(sessionData)

				var loggedInUserEmailAddress = sessionDetails.owaUserConfig.SessionSettings.UserEmailAddress
						|| sessionDetails.owaUserConfig.SessionSettings.LogonEmailAddress;

				initializeOutlookEmailEvents(loggedInUserEmailAddress);

			}, {
				method : "post"
			});

}

function initializeOutlookOfficeTracker() {
	
	injectScript(chrome.extension.getURL("js/outlook2.js"));

	Xtion_request(
			"https://outlook.office.com/owa/sessiondata.ashx?app=Mail",
			function(sessionData) {

				var sessionDetails = JSON.parse(sessionData);

				var loggedInUserEmailAddress = sessionDetails.owaUserConfig.SessionSettings.UserEmailAddress
						|| sessionDetails.owaUserConfig.SessionSettings.LogonEmailAddress;

				initializeOutlookEmailEvents(loggedInUserEmailAddress);

			}, {
				method : "post"
			});
}

function initializeOutlookOffice365Tracker() {

	injectScript(chrome.extension.getURL("js/outlook2.js"));

	Xtion_request(
			"https://outlook.office365.com/owa/sessiondata.ashx?app=Mail",
			function(sessionData) {

				var sessionDetails = JSON.parse(sessionData)

				var loggedInUserEmailAddress = sessionDetails.owaUserConfig.SessionSettings.UserEmailAddress
						|| sessionDetails.owaUserConfig.SessionSettings.LogonEmailAddress;

				initializeOutlookEmailEvents(loggedInUserEmailAddress);

			}, {
				method : "post"
			});

	/*
	 * injectScript(chrome.extension.getURL("js/outlook.js"));
	 * 
	 * setTimeout( function() {
	 * 
	 * Variable( "owaSDState.data", function(sessionData) {
	 * 
	 * var sessionDetails = JSON.parse(sessionData)
	 * 
	 * var loggedInUserEmailAddress =
	 * sessionDetails.owaUserConfig.SessionSettings.UserEmailAddress ||
	 * sessionDetails.owaUserConfig.SessionSettings.LogonEmailAddress;
	 * 
	 * initializeOutlookEmailEvents(loggedInUserEmailAddress);
	 * 
	 * }); }, 3000);
	 */

}

function initializeOutlookEmailEvents(loggedInUserEmailAddress) {

	if (!loggedInUserEmailAddress) {
		reportError();
		return;
	}

	if (window.engagebay_listening_sent)
		return;

	window.engagebay_listening_sent = 1;

	document
			.addEventListener(
					"engagebay_email_send",
					function(emailDetails) {

						var sid = emailDetails.detail.sid;
						var d = emailDetails.detail.post;

						var body = d['Body'];

						var json = {};

						var emailRecipients = getRecipientsFromOutlookComposeView(body.Items ? body.Items[0].ToRecipients
								: body.ItemChanges[0].Updates);
						if (emailRecipients.length == 0)
							return;

						json.recipients = JSON.stringify(emailRecipients);

						json.random_id = sid;

						json.subject = getSubjectFromOutlookComposeView(body.Items ? body.Items[0].Subject
								: body.ItemChanges[0].Updates);

						json.from_email = loggedInUserEmailAddress;

						OUTLOOK_SENT_EMAIL_DETAILS[sid] = json;

						var item = getContentItemFromOutlookComposeView(body.Items ? body.Items[0].NewBodyContent ? body.Items[0].NewBodyContent
								: body.Items[0].Body
								: body.ItemChanges[0].Updates);

						json.html_content = item.Value;
						try {
							
							var $htmlContent = $("<div>" + json.html_content
									+ "</div>");
							$htmlContent.find('div#engagebay-track').remove();
							
							json.sync_contacts = ($htmlContent.find(".eb-sync").attr("data-sync")) ? $htmlContent.find(".eb-sync").attr("data-sync") : false;
							$htmlContent.find('.eb-sync').remove();

							json.html_content = $htmlContent.html();
							
						} catch (e) {
						}
						json.html_content = json.html_content.replace(
								/openmail/g, 'empty');
						json.mail_client = 'outlook';

						document.documentElement.setAttribute("data-" + sid
								+ "-body-html", insertOutlookEngagebayTrack(
								item.Value, json));

					});

	document.addEventListener("engagebay_email_sent",
			function(sentEmailDetails) {

				var sid = sentEmailDetails.detail.sid;

				var json = OUTLOOK_SENT_EMAIL_DETAILS[sid];
				if (!json)
					return;

				setTimeout(function() {
					// Sync to
					// recipients as
					// contacts and add
					// activity
					_EB_Request_Processor(
							"/api/browser-extension/on-email-sent", json,
							"POST", function() {

							}, function(error) {
								console.log(error);
							});
				}, 2000)

			});

}

function insertOutlookEngagebayTrack(html, json) {

	if (!html)
		return html;

	// console.log("html", html);

	try {

		var parser = new DOMParser();
		var doc = parser.parseFromString("<!DOCTYPE html>" + html, "text/html");
		// var doctype = new XMLSerializer().serializeToString(doc.doctype);

		var $body = $(doc.documentElement).find('body');

		// Append footer
		if (!ENGAGEBAY_AUTH_USER_DATA || !ENGAGEBAY_AUTH_USER_DATA.planIds
				|| ENGAGEBAY_AUTH_USER_DATA.planIds.length == 0)
			$body
					.append(EngageBayGetAndCompileTemplate('engagebay-footer',
							{}));

		var $trackEle = $body.find('.engagebay-track-image');
		
		var isTrackable = ($trackEle.length == 0) ? false : true;
		if (isTrackable) {

			// Add track only if track is enabled
			$body.find('.engagebay-track-image').replaceWith(
					EngageBayGetAndCompileTemplate('track-content-outlook',
							json));

			$body.find('a').each(
					function() {

						var href = $(this).attr('href');

						// Check is forward email
						if (href.indexOf("eblink1.com") != -1)
							return;

						var newJSON = json;
						newJSON.url = href;

						if (newJSON.url && newJSON.url.trim() != "#")
							$(this).attr(
									'href',
									EngageBayGetAndCompileTemplate('link-open',
											newJSON));

					});

		}

		// console.log("html 1", doc.documentElement.outerHTML);

		return (doc.documentElement.outerHTML);

	} catch (e) {

		console.info(e);

		return html;

		// var u = document.createDocumentFragment();
		// var m = document.createElement("div");
		//
		// u.appendChild(m);
		//
		// m.innerHTML = html;
		//
		// m.insertAdjacentHTML("beforeend", '<div id="engagebay-track">'
		// + EngageBayGetAndCompileTemplate('track-content', json)
		// + '</div>'
		// + EngageBayGetAndCompileTemplate('engagebay-footer', {}));
		//
		// return m.innerHTML;
	}
}

function initlializeOutllokEngagebayToolkit() {

	initializeTimer();

	function initializeTimer() {

		setTimeout(
				function() {

					if ($(OUTLOOK_VIEW_REFERENCE_ELEMENTS[SERVICE_TYPE].compose_view_container_id).size == 0)
						return;

					$
							.each(
									$(OUTLOOK_VIEW_REFERENCE_ELEMENTS[SERVICE_TYPE].compose_view_container_id),
									function(index, ele) {
										
										if ($(ele).find(
												'.engagebay-subject-toolbar')
												.size() > 0)
											return;

										appendOutlookToolbar($(ele));

									});

					initializeTimer();

				}, 1000);
	}

	function appendOutlookToolbar($composeView) {

		$composeView
				.find(
						OUTLOOK_VIEW_REFERENCE_ELEMENTS[SERVICE_TYPE].compose_view_toolbar_container_id)
				.prepend(
						'<div class="_3oLux_o0jHTGNxtHPIiyQs" style="height: 34px;padding: 0px;">'
								+ EngageBayGetAndCompileTemplate(
										"outlook-toolkit",
										{
											'outlook_service_type' : SERVICE_TYPE
										}) + '</div>');

		
		// content block not loading immediately
		setTimeout(() => {
			checkAndToggleTrackContent(true, $composeView);
		}, 2000);

		initializeComposeViewEvents($composeView);

	}

}

function checkAndToggleTrackContent(isTackable, $composeView) {

	$composeView.find('img[src*="https://eblink1.com/openmail"]').remove();

	if (isTackable) {
		$composeView
				.find(
						OUTLOOK_VIEW_REFERENCE_ELEMENTS[SERVICE_TYPE].compose_view_content_container_id)
				.prepend(
						EngageBayGetAndCompileTemplate('track-content-outlook',
								{}));

	}

}

function toggleEngagebayContactSync(sync, $composeView) {

	var $refEle = $composeView
	.find(
			OUTLOOK_VIEW_REFERENCE_ELEMENTS[SERVICE_TYPE].compose_view_content_container_id);
	
	if($refEle.find('.eb-sync').length == 0)
		$refEle.append("<span class='eb-sync'></span>");
	
	$refEle.find('.eb-sync').attr("data-sync", sync);
	
}

function initializeComposeViewEvents($composeView) {

	checkAndToggleTrackContent(true, $composeView);
	$('.engageBayTrackEmail', $composeView).change(function() {
		checkAndToggleTrackContent($(this).is(":checked"), $composeView);
	});
	
	toggleEngagebayContactSync(false, $composeView);
	$('.engageBaySyncContacts', $composeView).change(function() {
		toggleEngagebayContactSync($(this).is(":checked"), $composeView);
	});

	$("#engagebayEmailTemplates", $composeView)
			.click(
					function() {

						var $emailTempPopup = $(EngageBayGetAndCompileTemplate(
								'modal-popup', {
									header : "Email Templates"
								}));

						$('body').append($emailTempPopup);
						$emailTempPopup.show();

						$(".close", $emailTempPopup).click(function() {
							$emailTempPopup.remove();
						});
						// Ghanshyam
						_EB_Request_Processor(
								"/api/browser-extension/all-templates-by-folder",
								{},
								"POST",
								function(templateData) {
									
									var categorisedTemplates = templateData;

									// var categorisedTemplates = groupEmailTemplates(templateData)

									$emailTempPopup
											.find(".contentContainer")
											.html(
													EngageBayGetAndCompileTemplate(
															"templates-list",
															categorisedTemplates));
									initTabEvents();
									$(".predesignedTemplate", $emailTempPopup)
											.click(
													function() {

														if ($(this).hasClass(
																'disabled'))
															return;

														$(this).addClass(
																'disabled');
														$(this)
																.html(
																		"<img src='"
																				+ browser.extension
																						.getURL("images/f-loader.gif")
																				+ "' style='height: 8px;width: 12px;padding-right: 5px;'>"
																				+ " Loading...");

														$
																.ajax({
																	type : "GET",
																	data : {},
																	dataType : 'text',
																	timeout : 0,
																	url : 'https://app.engagebay.com/misc/email-builder/elements/predesigned/'
																			+ $(
																					this)
																					.attr(
																							'data-t-id')
																			+ '.html',
																	success : function(
																			data) {

																		var $appendEle = $composeView
																				.find(OUTLOOK_VIEW_REFERENCE_ELEMENTS[SERVICE_TYPE].compose_view_content_container_id);

																		$appendEle
																				.prepend('<div>'
																						+ data
																						+ '</div>');

																		$emailTempPopup
																				.remove();

																		$appendEle
																				.focus();

																	},
																	error : function(
																			error) {
																		console
																				.log(error);
																	}

																});

													});
									// Ghanshyam
									$("#templateContent .choose-template",
											$emailTempPopup)
											.click(
													function() {
														// console.log("outlook");

														var templateId = $(this)
																.attr(
																		'data-t-id');
														// console.log(templateId);
														// console.log("outlook1");
														var data = engageBayGetEmailTemplateByCategory(templateId, templateData);
														if(data) {
															// console.log(data.id);
															// console.log("outlook3");
															var $appendEle = $composeView
																	.find(OUTLOOK_VIEW_REFERENCE_ELEMENTS[SERVICE_TYPE].compose_view_content_container_id);
															// console.log($appendEle);
															// console.log("outlook4");
															try {
																$appendEle
																		.prepend('<div>'
																				+ data.email_body
																				+ '</div>');
															} catch (err) {
																console
																		.log(err.message);
															}

															$emailTempPopup
																	.remove();

															$appendEle
																	.focus();
														}

													});

								}, function(error) {
									console.log(error);
								});

					});

}

function engageBayGetEmailTemplateByCategory(templateId, templateData){
var tempData = null;
$.each(
		templateData,
		function(
				index,
				data) {
			if (data.id == templateId) {
				tempData = data;
			}
			else if(data.template_type == "FOLDER" && data.folderTemplatesList && data.folderTemplatesList.length > 0)
			{
				$.each(data.folderTemplatesList, function(index2, data2) {
					if (data2.id == templateId) {
						tempData = data2;
					}
				});
			}
		});

	return tempData;
}

var OUTLOOK_VIEW_REFERENCE_ELEMENTS = {

	'live' : {
		compose_view_toolbar_container_id : "._1vGTUqFfb2m4yyZJJPHFDg._1PGX4GmfSf_CaaQSnoiB4l",
		compose_view_content_container_id : "._4utP_vaqQ3UQZH0GEBVQe.B1QSRkzQCtvCtutReyNZ._17ghdPL1NLKYjRvmoJgpoK._2s9KmFMlfdGElivl0o-GZb",
		compose_view_container_id : "._3gI_crMwmfcn18RAAThSVI"
	},

	'office' : {
		compose_view_toolbar_container_id : "._1vGTUqFfb2m4yyZJJPHFDg._1PGX4GmfSf_CaaQSnoiB4l",
		compose_view_content_container_id : "._4utP_vaqQ3UQZH0GEBVQe.B1QSRkzQCtvCtutReyNZ",
		compose_view_container_id : "._3gI_crMwmfcn18RAAThSVI._91LG5yQRzdMWoEcLoAg67"
	},
	'office365' : {
		compose_view_toolbar_container_id : "._1vGTUqFfb2m4yyZJJPHFDg._1PGX4GmfSf_CaaQSnoiB4l",
		compose_view_content_container_id : "._4utP_vaqQ3UQZH0GEBVQe.B1QSRkzQCtvCtutReyNZ",
		compose_view_container_id : "._3gI_crMwmfcn18RAAThSVI._91LG5yQRzdMWoEcLoAg67"
	}

}

function groupEmailTemplates(templateData) {
	var categoriesed_Templates = {};
	$.each(templateData, function(index, object) {

		if (!categoriesed_Templates[object.build_type])
			categoriesed_Templates[object.build_type] = new Array();

		categoriesed_Templates[object.build_type].push(object);

	});

	return categoriesed_Templates;
}
function initTabEvents(el) {
	$(".tab-container .nav-tabs  li a").click(function(e) {
		e.preventDefault();
		var currentElement = $(e.currentTarget).attr("data-href")
		$(".tab-container .nav-tabs  li").removeClass("active");
		$(".tab-content .tab-pane.active").removeClass("active");
		$(e.currentTarget).parent().addClass("active");
		$("#" + currentElement).addClass("active");
	});
}
