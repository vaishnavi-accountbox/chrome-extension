'use strict';

var INBOX_SDK_APP_ID = "sdk_engagebay_1d3d066dbf";
var LOGGED_IN_GMAIL_USER;

var ENGAGEBAY_GMAIL_THREAD_ROW_HANDLER;

(function() {

	authenticateUser(function() {
		EBInitializeInboxSDKTools(true);
	}, function() {
		EBInitializeInboxSDKTools(false);
	});

})();

/**
 * Selectors for various components of gmail. In case gmail's UI is changed and
 * the selectors fail to work, update here.
 */
var gmailSelectors = {

	// compose window, after binding class
	compose_window : "td.I5",

};

var engageBayInboxSDK;

function EBInitializeInboxSDKTools(isLoggedInUser) {

	InboxSDK
			.load(2, INBOX_SDK_APP_ID)
			.then(
					function(sdk) {

						LOGGED_IN_GMAIL_USER = sdk.User.getEmailAddress()
								.trim();

						engageBayInboxSDK = sdk;

						if (!isLoggedInUser)
							return;

						sdk.Toolbars.addToolbarButtonForApp({
							// title : "EB",
							// titleClass : "engage-bay-app-toolbar",
							iconClass : 'engagebay-app-toolbar-icon',
							iconUrl : browser.extension
									.getURL('images/icon_32.png'),
							tooltip : 'Save Template',
							onClick : function(event) {

								var template = "";
								if (isLoggedInUser)
									template = EngageBayGetAndCompileTemplate(
											"toolbar-popover",
											ENGAGEBAY_AUTH_USER_DATA);
								else
									template = EngageBayGetAndCompileTemplate(
											"login-form", {});

								event.dropdown.el.innerHTML = template;
							}
						});

						// Inform to extension aboutn the logged gmail user
						// details
						browser.runtime.sendMessage({
							'event' : 'content_scripts_loaded',
							'logged_in_user_email' : sdk.User.getEmailAddress()
						}, function(response) {
						});

						// the SDK has been loaded, now do something with it!
						sdk.Compose.registerComposeViewHandler(function(
								composeView) {

							composeView.$el = $(composeView.getBodyElement())
									.closest(gmailSelectors.compose_window);

							if (composeView.$el.hasClass('engagebay-compose'))
								return;

							EBinitializeEventsOnComposeView(composeView);

						});

						// To show sent and read status on thread rows
						registerThreadRowViewHandler(sdk);

						sdk.Conversations
								.registerMessageViewHandlerAll(function(
										MessageViewObjj) {

									MessageViewObjj
											.getBodyElement()
											.querySelectorAll(
													'img[src*="https://eblink1.com/openmail?nid"]')
											.forEach(
													function(eventEle) {

														if (eventEle.src
																.indexOf("&from_email="
																		+ LOGGED_IN_GMAIL_USER) == -1) {
															window
																	.setTimeout(
																			function() {

																				eventEle.src = eventEle.src
																						.replace(
																								"?nid=",
																								"?f=true&nid=")

																			},
																			2000);
														}

													})

								});

						sdk.Conversations
								.registerThreadViewHandler(function(threadView) {

									var messageViewArray = threadView
											.getMessageViewsAll();

									var recipients = [];

									var promiseExecutedCount = 0;
									for (var i = 0; i < messageViewArray.length; i++) {

										var messageView = messageViewArray[i];

										try {
											recipients = $
													.merge(
															recipients,
															[ messageView
																	.getSender() ]);
										} catch (e) {
										}

										var promise = messageView
												.getRecipientsFull();
										promise
												.then(function(contacts) {
													recipients = $.merge(
															recipients,
															contacts);
													promiseExecutedCount++;

													if (promiseExecutedCount == messageViewArray.length
															&& recipients
															&& recipients.length > 0) {

														recipients = formatContactNameAndEmail(recipients, 'emailAddress');
														
														recipients = _EB_Remove_Duplicate_contacts(recipients, 'emailAddress');

														if (!recipients
																|| recipients.length == 0)
															return;

														_EB_splitAvailableAndUnavailableContacts(
																recipients,
																threadView);

													}

												});

									}

									threadView.on('contactHover', function(
											event) {
										// console.log("event contact hover",
										// event.contact);
									});

								});

						sdk.Conversations
								.registerMessageViewHandler(function(
										MessageView) {

									if (true)
										return;

									MessageView
											.addAttachmentIcon({
												iconUrl : browser.extension
														.getURL('images/icon_16.png'),
												iconClass : 'save-template',
												tooltip : 'Save Template',
												onClick : function(event) {

													var json = {};
													json.content = $(
															MessageView
																	.getBodyElement())
															.html();
													const saveEmailTemplateEl = document
															.createElement("div");
													saveEmailTemplateEl.innerHTML = EngageBayGetAndCompileTemplate(
															"save-email-template",
															json);

													sdk.Widgets
															.showModalView({
																el : saveEmailTemplateEl,
																showCloseButton : true
															});

													$(saveEmailTemplateEl)
															.find(
																	'.addTemplate')
															.click(
																	function() {
																		alert("send request to add to template");

																	});
												},
											});

								});

					});

}

function EBinitializeEventsOnComposeView(composeView) {

	// Generate a random number to identify email activities
	// Ass we do not have message id while sending new email
	// If we maintain messageId as randomid this will be helpfull in email
	// tracking
	var randomNumber = new Date().getTime();

	var $appendEle = $(EngageBayGetAndCompileTemplate("toolkit", {
		random_id : randomNumber
	}));
	if (composeView.isInlineReplyForm())
		$appendEle.addClass('HM iN');

	composeView.$el.addClass('engagebay-compose')
	composeView.$el.find('form.bAs').append($appendEle);

	var syncContactsToEngageBay = false;
	composeView.$el.find(".engageBaySyncContacts").on('change',
			function(event) {
				syncContactsToEngageBay = $(this).is(":checked");
			});

	var isTrackable = true;
	composeView.on('presending', function(event) {

		// console.log('On email presending', event);

		var $mailBody = $("<div>" + composeView.getHTMLContent() + "</div>");

		$mailBody.find('div#engagebay-track').remove();

		isTrackable = composeView.$el.find(".engageBayTrackEmail").is(
				":checked");

		var emailRecipients = getRecipientsFromComposeView(composeView);
		if (emailRecipients.length == 0)
			return;

		var json = {
			recipients : JSON.stringify(emailRecipients),
			random_id : randomNumber,
			subject : composeView.getSubject(),
			thread_id : "",
			from_email : engageBayInboxSDK.User.getEmailAddress(),
		};

		// Remove existing track if any (Possibility email
		// forward)
		$mailBody.find('img[src*="https://eblink1.com/openmail"]').remove();

		if (isTrackable) {

			// Push activity into log
			// Send message to extension
			$mailBody.append('<div id="engagebay-track">'
					+ EngageBayGetAndCompileTemplate('track-content', json)
					+ '</div>');

			$mailBody.find('a').each(
					function() {

						var href = $(this).attr('href');

						// Check is forward email
						if (href.indexOf("eblink1.com/repofilepreview") != -1
								|| href.indexOf("eblink1.com/openurl") != -1)
							return;

						var newJSON = json;

						if ($(this).hasClass('engageBayDocumentAttachment')) {
							newJSON.repo_id = $(this).attr('data-id');
							// json.repo_name =
							// $(this).text();
							$(this).attr(
									'href',
									EngageBayGetAndCompileTemplate(
											'inline-attachment', newJSON));
						} else {

							// Here is a possibility of
							// having forwaded engagebay
							// links

							newJSON.url = href;

							if (newJSON.url && newJSON.url.trim() != "#")
								$(this).attr(
										'href',
										EngageBayGetAndCompileTemplate(
												'link-open', newJSON));
						}

					});

		}

		// Append engagebay footer
		if (!ENGAGEBAY_AUTH_USER_DATA || !ENGAGEBAY_AUTH_USER_DATA.planIds
				|| ENGAGEBAY_AUTH_USER_DATA.planIds.length == 0)
			$mailBody.append(EngageBayGetAndCompileTemplate('engagebay-footer',
					{}));

		composeView.setBodyHTML($mailBody.html());

	});

	composeView
			.on(
					'sent',
					function(event) {

						// console.log('On email sent', event);

						var threadPromise = event.getThreadID();
						threadPromise.then(function(id) {
							onThreadIdFetched(id);
							registerThreadRowViewHandler(engageBayInboxSDK);
						});

						function onThreadIdFetched(threaddId) {

							var emailRecipients = getRecipientsFromComposeView(composeView);
							if (emailRecipients.length == 0)
								return;

							var json = {};
							json.sync_contacts = syncContactsToEngageBay;
							json.recipients = JSON.stringify(emailRecipients);
							json.thread_id = threaddId;
							json.random_id = randomNumber;
							json.subject = composeView.getSubject();
							json.from_email = engageBayInboxSDK.User
									.getEmailAddress();
							json.html_content = composeView.getHTMLContent();
							try {
								var $htmlContent = $("<div>"
										+ json.html_content + "</div>");
								$htmlContent.find('div#engagebay-track')
										.remove();
								json.html_content = $htmlContent.html();
							} catch (e) {
							}
							json.html_content = json.html_content.replace(
									/openmail/g, 'empty');
							json.mail_client = 'gmail';
							// json.text_content = composeView.getTextContent();

							setTimeout(function() {
								// Sync to recipients as contacts and add
								// activity
								_EB_Request_Processor(
										"/api/browser-extension/on-email-sent",
										json, "POST", function() {

										}, function(error) {
											console.log(error);
										});
							}, 2000)

							if (isTrackable)
								engageBaySaveSentEmailThreadIdsInStorage(
										threaddId, randomNumber, false);

						}

					});

	composeView.$el
			.find("#engagebayEmailTemplates")
			.click(
					function() {

						const el = document.createElement('div');
						el.innerHTML = EngageBayGetAndCompileTemplate(
								"popup-loader", {});

						const modal = engageBayInboxSDK.Widgets.showModalView({
							el : el,
							chrome : true,
						});
						_EB_Request_Processor(
								"/api/browser-extension/all-templates-by-folder",
								{},
								"POST",
								function(templateData) {

									// var categorisedTemplates = groupEmailTemplates(templateData);
									$(el).html(
											EngageBayGetAndCompileTemplate(
													"templates-list",
													templateData));
									
									initTabEvents(el);
									$(el)
											.find(".predesignedTemplate")
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

														// Ghanshyam
														_EB_Request_Processor(
																"/api/browser-extension/predesigned?name="
																		+ $(
																				this)
																				.attr(
																						'data-t-id')
																		+ "&apiKey="
																		+ ENGAGEBAY_AUTH_USER_DATA.api_key.js_API_Key,
																{},
																"POST",
																function(
																		response) {

																	var state = true;
																	if (!response
																			|| !response.count
																			|| response.count == 0)
																		state = false;

																	composeView
																			.setBodyHTML(response);
																	modal
																			.close();

																});

														/*
														 * $ .ajax({ type :
														 * "POST", data : {},
														 * dataType : 'text',
														 * timeout : 0, url :
														 * 'https://app.engagebay.com/misc/email-builder/elements/predesigned?name=' +
														 * $(this).attr('data-t-id') +
														 * '&apiKey=' +
														 * '&apiKey=' +
														 * ENGAGEBAY_AUTH_USER_DATA.api_key.js_API_Key,
														 * success : function(
														 * data) { composeView
														 * .setBodyHTML(data);
														 * modal .close(); },
														 * error : function(
														 * error) { console
														 * .log(error); }
														 * 
														 * });
														 */

													});

									$(el)
											.find(
													"#templateContent .choose-template")
											.click(
													function() {
														var templateId = $(this)
																.attr(
																		'data-t-id');
														
														var data = engageBayGetEmailTemplateByCategory(templateId, templateData);
														if(data){
															// fill subject
															if(data.subject)
																composeView.setSubject(data.subject);
															
															var torecipients = composeView.getToRecipients();
															if(torecipients && torecipients.length == 1){

																// Fetch subscriber
																_EB_Request_Processor("/api/browser-extension/get-compiled-email-content", 
																		{subject: data.subject, email: torecipients[0].emailAddress, email_body : data.email_body}, "POST", function(response) {
																			
																			if(response && response.subject)
																				composeView.setSubject(response.subject);
																			
																			if(response && response.email_body)
																					composeView.setBodyHTML(response.email_body);
																			else{
																				composeView.setBodyHTML(data.email_body);
																			}

																}, function(err) {
																	// console.log(err);
																	composeView.setBodyHTML(data.email_body);
																});
																
															
															}else{
																composeView
																.setBodyHTML(data.email_body);
															}
															
															modal
																	.close();
														}

													});
									

								}, function(error) {
									console.log(error);
								});

					});

	composeView.$el
			.find("#engagebayDocuments")
			.click(
					function() {

						const el = document.createElement('div');
						el.innerHTML = EngageBayGetAndCompileTemplate(
								"popup-loader", {});

						var dataLoaded = false;
						var folderId, cursor;
						
						const modal = engageBayInboxSDK.Widgets
								.showModalView({
									el : el,
									chrome : true,
									title: 'File Repository',
									buttons : [
											{
												text : "Select",
												onClick : function() {

													if (!dataLoaded)
														return;

													var $selectedDocs = $('input[name="engagebay_document"]:checked');
													if ($selectedDocs.size() > 0) {

														var appendItem = "";
														$selectedDocs
																.each(function(
																		index,
																		ele) {

																	var docId = $(
																			this)
																			.attr(
																					'data-id');

																	var docName = $(
																			this)
																			.attr(
																					'data-name');
																	var docURL = $(
																			this)
																			.attr(
																					'data-url');

																	appendItem += ' <a data-id="'
																			+ docId
																			+ '" class="engageBayDocumentAttachment" href="'
																			+ docURL
																			+ '">'
																			+ docName
																			+ '</a>';

																});
														composeView
																.insertHTMLIntoBodyAtCursor(appendItem);
														modal.close();

													} else {

														$(
																"#documentErrorContainer",
																el)
																.html(
																		"<div style='text-align:center;color:red;padding-bottom: 20px;'>You have not selected any documents. Please select at least one record to continue.</div>");
														setTimeout(
																function() {
																	$(
																			"#documentErrorContainer",
																			el)
																			.html(
																					"");
																}, 6000);

													}

												},
												type : 'PRIMARY_ACTION',
												color : 'blue'
											}, {
												text : "Close",
												onClick : function() {
													modal.close();
												},
												color : 'red'
											},{
												text : "Next",
												onClick : function() {
													// Fetch next
													fetchList();
												},
												color : 'red'
											}]
								});

						$(el).on('click', '.FOLDER td', function() {
							console.log('click');
							folderId = $(this).closest('tr').attr('data-id');
							if(!folderId)
								return;
							
							cursor = undefined;
							
							$('tbody', el).html("");
							
							fetchList();
							
						});
						
						$(el).on('click', '.back-from-folder', function(e) {
							
							e.preventDefault();
							
							folderId = undefined;
							cursor = undefined;
							
							$('tbody', el).html("");
							
							fetchList();
							
						});
						
						$(':last-child', '.inboxsdk__modal_buttons').hide();
						fetchList();
						
						function fetchList() {
							
							fetchRepoCollection(folderId, cursor, function(repoList) {
								
								if($('tbody', el).length == 0){
									$(el)
									.html(
											EngageBayGetAndCompileTemplate(
													"documents-list-collection",
													repoList));
								}
								
								$('tbody', el).append(
										EngageBayGetAndCompileTemplate(
												"documents-list",
												repoList));
								
								if(folderId){
									// Show back botton
									$('.back-from-folder', el).show();
								}else{
									$('.back-from-folder', el).hide();
								}
								
								dataLoaded = true;
								
								try {
									cursor = repoList[repoList.length - 1].cursor;									
								} catch (e) {
									cursor = undefined;
								}
								
								if(!cursor)
									$(':last-child', '.inboxsdk__modal_buttons').hide();
								else
									$(':last-child', '.inboxsdk__modal_buttons').show();
							});
						}
						
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

function engageBaySaveSentEmailThreadIdsInStorage(threadId, messageId,
		readState) {

	_EB_storage.get_local_storage(ENGAGEBAY_SENT_EMAIL_THREAD_ID_LIST,
			function(sendEmails) {

				if (!sendEmails)
					sendEmails = [];

				var isMatchFound = false;
				for (var i = 0; i < sendEmails.length; i++) {
					if (sendEmails[i][0] == threadId) {
						sendEmails[i][1] = messageId;
						sendEmails[i][2] = readState;
						isMatchFound = true;
						break;
					}
				}

				if (!isMatchFound)
					sendEmails.push([ threadId, messageId, readState ]);

				_EB_storage.set_local_storage(
						ENGAGEBAY_SENT_EMAIL_THREAD_ID_LIST, sendEmails,
						function() {

						});

			});

}

function EngageBayHandleEachRowView(rowViewRef) {

	var promise = rowViewRef.getThreadIDIfStableAsync();
	promise.then(function(threadId) {

		if (threadId)
			onThreadIdFetchedFromRowView(threadId, rowViewRef)

	});

	function onThreadIdFetchedFromRowView(threadId, rowViewObj) {

		if (!threadId)
			return;

		// Get data from browser cache
		EngageBayGetEmailThreadStatus(
				threadId,
				function(threadDetails) {

					if (!threadDetails)
						return;

					if (threadDetails[2]) {
						EngageBayupdateThreadRowViewIcons(rowViewObj,
								threadDetails[2]);
						return;
					} else {

						// Get read status from server and sync with storage
						// Ghanshyam
						_EB_Request_Processor(
								"/api/browser-extension/get-email-thread-read-count?thread_id="
										+ threadDetails[0]
										+ "&message_id="
										+ threadDetails[1]
										+ "&apiKey="
										+ ENGAGEBAY_AUTH_USER_DATA.api_key.js_API_Key,
								{}, "POST", function(response) {

									var state = true;
									if (!response || !response.count
											|| response.count == 0)
										state = false;

									engageBaySaveSentEmailThreadIdsInStorage(
											threadId, threadDetails[1], state);
									EngageBayupdateThreadRowViewIcons(
											rowViewObj, state);

								});
						return;
					}

				});

	}

}

function EngageBayGetEmailThreadStatus(threadId, callback) {

	_EB_storage.get_local_storage(ENGAGEBAY_SENT_EMAIL_THREAD_ID_LIST,
			function(sendEmails) {

				if (!sendEmails) {
					callback(undefined);
					return;
				}

				var threadDetails;
				var len = sendEmails.length;
				for (var i = 0; i < len; i++) {

					if (sendEmails[i][0] == threadId) {
						threadDetails = sendEmails[i];
						break;
					}

				}

				callback(threadDetails);

			});

}

function EngageBayupdateThreadRowViewIcons(listView, status) {

	if (status) {
		listView.addAttachmentIcon({
			title : "read",
			iconUrl : browser.extension
					.getURL("images/engagebay-email-read.svg"),
			iconClass : "eb-thread-view-icon",
		});
	} else {
		listView.addAttachmentIcon({
			title : "unread",
			iconUrl : browser.extension
					.getURL("images/engagebay-email-sent.svg"),
			iconClass : "eb-thread-view-icon",
		});

	}

}

var ENGAGEBAY_DOMAIN_STATIC_LIST;
function _EB_splitAvailableAndUnavailableContacts(contacts, threadView) {

	// Sync to recipients as contacts and add activity
	_EB_Request_Processor("/api/browser-extension/get-contact-availability", {
		'contacts' : JSON.stringify(contacts)
	}, "POST", function(response) {

		if (!response)
			return;

		// if (!response || !response.unavailable_contacts
		// || response.unavailable_contacts.length == 0)
		// return;

		const el = document.createElement("div");
		el.innerHTML = EngageBayGetAndCompileTemplate("thread-sidebar-view",
				response);

		threadView.addSidebarContentPanel({
			title : 'Contacts',
			iconUrl : browser.extension.getURL('images/icon_32.png'),
			el : el,
			appIconUrl : browser.extension.getURL('images/icon_32.png'),
			appName : "EngageBay",
			iconClass : "engagebay-sidebar-icon",
		});

		initializeThreadSideBarContactViewEvents($(el));
		fetchStaticList();

		function fetchStaticList(callback){

			if(!ENGAGEBAY_DOMAIN_STATIC_LIST){
				// 
				_EB_Request_Processor("/api/panel/contactlist/static-lists", {},
					"GET", function(listData) {

					ENGAGEBAY_DOMAIN_STATIC_LIST = listData;
					if(callback)
						callback(ENGAGEBAY_DOMAIN_STATIC_LIST);

					}, function(error) {
						console.log(error);
					});
				
			}else{
				if(callback)
						callback(ENGAGEBAY_DOMAIN_STATIC_LIST);
			}
		
		}

		function askForListId(callback) {

			function popupRender(list){

					if(!list)
					list = [];

					if(list.length == 0){
				
							if (callback)
								callback(0);
				
							return;
					}else{
						const el = document.createElement('div');
						el.innerHTML = EngageBayGetAndCompileTemplate("popup-loader", {});

						const modal = engageBayInboxSDK.Widgets.showModalView({
							el : el,
							chrome : true,
							title : "Select List"
						});

		
						$(el).html(
								EngageBayGetAndCompileTemplate(
										"contact-list-template", list));

						$(el).find("#templateContent .choose-list").click(
								function() {

									var listId = $(this).attr('data-list-id');

									if (callback)
										callback(listId);

									modal.close();
									return false;

								});
					}
			}

			fetchStaticList(popupRender);

		}

		$(el).find('.addContact').click(
				function(event, bulkadding, listId) {

					console.log('listId', listId);
					console.log('bulkadding', bulkadding);

					var $that = $(this);

					if ($that.hasClass('disabled'))
						return;

					if (!bulkadding) {
						askForListId(function(selectedlistId) {
							listId = selectedlistId;
							addContact();
						});
					} else {
						addContact();
					}

					function addContact() {

						var contactJSON = {};
						contactJSON.email = $that.attr('data-email');
						contactJSON.name = $that.attr('data-name');
						contactJSON.listId = listId;

						$that.addClass('disabled');
						$that.attr('disabled', 'disabled');
						$that.text('Adding...');

						_EB_Request_Processor(
								"/api/browser-extension/add-contact",
								contactJSON, "POST", function(response) {
									$that.text('Added');
								});

					}
				});

		$(el).find('.addBulkContacts').click(function() {
			askForListId(function(listId) {
				$(el).find('.addContact').trigger('click', [ true, listId ]);
			});
		});

	}, function(error) {
		console.log(error);
	});

}

function _EB_Remove_Duplicate_contacts(originalArray, objKey) {
	var trimmedArray = [];
	var values = [];
	var value;

	for (var i = 0; i < originalArray.length; i++) {
		value = originalArray[i][objKey];

		if (values.indexOf(value) === -1
				&& value.toLowerCase() != engageBayInboxSDK.User
						.getEmailAddress().toLowerCase()) {
			trimmedArray.push(originalArray[i]);
			values.push(value);
		}
	}

	return trimmedArray;

}

function getRecipientsFromComposeView(composeView) {

	var ccrec = composeView.getCcRecipients();
	if (!ccrec)
		ccrec = [];

	var bccrec = composeView.getBccRecipients();
	if (!bccrec)
		bccrec = [];

	var toRec = composeView.getToRecipients();
	if (!toRec)
		toRec = [];

	var recipients = ccrec.concat(bccrec).concat(toRec);
	
	recipients = formatContactNameAndEmail(recipients, 'emailAddress');

	return recipients;

}

function removeDuplicatesFromArray(originalArray, prop) {
	var newArray = [];
	var lookupObject = {};

	for ( var i in originalArray) {
		lookupObject[originalArray[i][prop]] = originalArray[i];
	}

	for (i in lookupObject) {
		newArray.push(lookupObject[i]);
	}
	return newArray;
}

function formatContactNameAndEmail(recipients, key){
	
	if(!recipients || recipients.length == 0)
		return recipients;
	
	recipients = removeDuplicatesFromArray(recipients, key);

	for (var i = 0; i < recipients.length; i++) {
		
			try {
				
				var name = recipients[i]['name'];
				if (!name || name == "null" || name === null)
					name = recipients[i].emailAddress.match(/^([^@]*)@/)[1];
				
				if(name)
					name = name.split(/[.\-_ ]/).join(" ");
				
				
				if(name)
					recipients[i]['name'] = name;
		
			} catch (e) {
			}
								
	}
	
	console.log("recipients", recipients);

	return recipients;
	
}

function registerThreadRowViewHandler(gmailSDK) {

	// To show sent and read status on thread rows
	if (ENGAGEBAY_GMAIL_THREAD_ROW_HANDLER)
		ENGAGEBAY_GMAIL_THREAD_ROW_HANDLER();

	ENGAGEBAY_GMAIL_THREAD_ROW_HANDLER = gmailSDK.Lists
			.registerThreadRowViewHandler(function(rowViewEvent) {
				EngageBayHandleEachRowView(rowViewEvent);
			});

}

function initializeThreadSideBarContactViewEvents($el) {

	$el.on('click', '.close-contact-detailed-view-container', function() {
		$el.find('.eb-sidebar').removeClass('contact-details-active ');
	});

	$el.on('click', '.thread-view-contact', function() {

		$el.find('.eb-sidebar').addClass('contact-details-active ');

		$el.find(".contact-detailed-view-container").html(
				'<img src="' + browser.extension.getURL("images/f-loader.gif")
						+ '" style="height: 8px;width: 12px;padding: 10px;">');

		var email = $(this).attr('data-email');

		loadSidebarContactView($el.find(".contact-detailed-view-container"),
				email);

	});

}

function loadSidebarContactView($el, email) {

	if (!email)
		$el.html("Email not found");

	_EB_Request_Processor("/api/browser-extension/getByEmail/" + email, {},
			"POST", function(contactData) {

				var $template = $(EngageBayGetAndCompileTemplate(
						"contact-details-view", contactData));

				initializeContactViewEvents($template, contactData);

				$el.html($template);

			}, function(error) {
				$el.html(error);
			});

}

function loadAndinitlializeEditContactViewEvents(subscriberDetails) {

	console.log('subscriberDetails', subscriberDetails);

	const el = document.createElement('div');
	el.className = "eb-drawer-view-body"
	el.innerHTML = EngageBayGetAndCompileTemplate("edit-contact", {});

	const editContactModal = engageBayInboxSDK.Widgets.showDrawerView({
		el : el,
		chrome : true,
		title : "Edit Contact"
	});

	getEbEntityFields("CONTACT", subscriberDetails, function(html) {

		$(el).html(
				"<div><form id='editSubscriberForm' class='eb-form'>" + html
						+ EngageBayGetAndCompileTemplate('form-footer')
						+ "</form></div>");

		handleEngagebayFormData(el, editContactModal, subscriberDetails, {
			url : '/api/panel/subscribers/subscriber',
			onloadCallback : function(el, json) {
				loadCompanyTags($(el), json);
			},
			saveBeforeCallback : contactSaveBeforeCallback,
			successCallback : function(newSubDetails) {

				// get email from details
				var emailarray = getEmailArray(newSubDetails);
				if (emailarray.length == 0)
					return;

				var email = "";
				for (var j = 0; j < emailarray.length; j++) {
					if (emailarray[j].subtype == "primary")
						email = emailarray[j].value;
				}

				loadSidebarContactView($(".contact-detailed-view-container"),
						email);
			},
			successMessage : 'contact details has been updated successfully.'
		});

	});

}

function initializeContactViewEvents($contactView, subscriberDetails) {

	$contactView.on('click', '.edit-contact', function() {
		loadAndinitlializeEditContactViewEvents(subscriberDetails);
	});

	$contactView.find('.contact-image').on('error', function() {
		$(this).attr('src', getIntialImage(subscriberDetails.fullname));
	});

	$contactView.on('click', '.contact-options-toggle .head', function() {

		var $ele = $(this).closest('.contact-options-toggle');

		var isActive = $ele.hasClass("active");
		if (isActive) {
			$ele.removeClass("active");
			return;
		}

		$ele.addClass("active");
		var triggerName = $ele.attr("data-trigger-name");
		if (triggerName)
			$ele.trigger(triggerName);

	});

	$contactView.on('loadDeals', '.contact-options-toggle.deals', function() {

		loadRespectiveView($(this).find(".content"), subscriberDetails,
				"/api/panel/deals/contact/" + subscriberDetails.id + "/deals",
				"POST", "contact-deal-details-view");

	});

	$contactView.on('loadTasks', '.contact-options-toggle.tasks', function() {

		loadRespectiveView($(this).find(".content"), subscriberDetails,
				"/api/panel/tasks/contact/" + subscriberDetails.id + "/tasks",
				"POST", "contact-task-details-view");

	});

	$contactView.on('loadNotes', '.contact-options-toggle.notes', function() {

		loadRespectiveView($(this).find(".content"), subscriberDetails,
				"/api/panel/notes/" + subscriberDetails.id, "GET",
				"contact-note-details-view");

	});

	$contactView.on('click', '.add-new-deal', function(e) {

		e.stopPropagation();

		const el = document.createElement('div');
		el.className = "eb-drawer-view-body"
		el.innerHTML = EngageBayGetAndCompileTemplate("edit-contact", {});

		const addDealModal = engageBayInboxSDK.Widgets.showDrawerView({
			el : el,
			chrome : true,
			title : "Add Deal"
		});
		
		var dealJSON = {};
		dealJSON.subscribers = [subscriberDetails];

		getEbEntityFields("DEAL", dealJSON, function(html) {

			$(el).html(
					"<div><form id='editDealForm' class='eb-form'>" + html
							+ EngageBayGetAndCompileTemplate('form-footer')
							+ "</form></div>");

			handleEngagebayFormData(el, addDealModal, dealJSON,
					{
						url : '/api/panel/deals/deal',
						onloadCallback : function(el, json) {

							fillselect($('.owner-select-list', el),
									'/api/panel/users', undefined, undefined, "<option value='{{id}}' {{#if selected}}selected='true'{{/if}}>{{name}}({{email}})</option>");
							
							fillselect($('.track-select-list', el),
									'/api/panel/tracks', undefined, function(selectedTack) {
								
								var milestoneArr = [];
								try {
									milestoneArr = selectedTack.milestones ;									
								} catch (e) {
								}
								
										fillselect($('.milestone-select-list',
												el), undefined, milestoneArr, function(selectedMilestone) {
													$('input[name="milestoneLabelName"]', el).val(selectedMilestone.labelName);
												}, "<option value='{{labelActualName}}' {{#if selected}}selected='true'{{/if}}>{{labelName}}</option>");
									
							
							}, "<option value='{{id}}' {{#if selected}}selected='true'{{/if}}>{{name}}</option>");

						},
						successCallback : function(dealDetails) {
							$('.contact-options-toggle.deals .head', $contactView).trigger('click');
						},
						successMessage : 'Deal has been added successfully.'
					});

		});

	});
	
	$contactView.on('click', '.add-new-task', function(e) {

		e.stopPropagation();

		const el = document.createElement('div');
		el.className = "eb-drawer-view-body"
		el.innerHTML = EngageBayGetAndCompileTemplate("edit-contact", {});

		const addTaskModal = engageBayInboxSDK.Widgets.showDrawerView({
			el : el,
			chrome : true,
			title : "Add Task"
		});
		
		var taskJSON = {};
		taskJSON.subscribers = [subscriberDetails];

		getEbEntityFields("TASK", taskJSON, function(html) {

			$(el).html(
					"<div><form id='editTaskForm' class='eb-form'>" + html
							+ EngageBayGetAndCompileTemplate('form-footer')
							+ "</form></div>");

			handleEngagebayFormData(el, addTaskModal, taskJSON,
					{
						url : '/create-task',
						prefix : "/jsapi/rest",
						onloadCallback : function(el, json) {

							fillselect($('.owner-select-list', el),
									'/api/panel/users', undefined, undefined, "<option value='{{id}}' {{#if selected}}selected='true'{{/if}}>{{name}}({{email}})</option>");
							
							 _EB_Request_Processor('/api/panel/taskcategory', {}, 'GET', function(resp) {
									
									if(!resp || !resp.id)
										return;
									
									var $li = "";
									$.each(resp.statuses, function(index, pojo) {
										$li += EngageBayCompileTemplate("<option value='{{this}}'>{{this}}</option>", pojo);
									});
									$('.task-status-list', el).html($li);
									
									var $li = "";
									$.each(resp.categories, function(index, pojo) {
										$li += EngageBayCompileTemplate("<option value='{{this}}'>{{this}}</option>", pojo);
									});
									$('.task-type-list', el).html($li);

								}, undefined,
								undefined, "/rest/ext");

					
						},
						successCallback : function(taskDetails) {
							$('.contact-options-toggle.tasks .head', $contactView).trigger('click');
						},
						successMessage : 'Task has been added successfully.',
						saveBeforeCallback : function(json){

							try {
							 delete json.subscribers
							} catch (e) {
								console.log(e);	
							}

							return json;

							
						}
					});

		});

	});

	$contactView
			.on(
					'click',
					'.add-deal',
					function(e) {

						e.stopPropagation();

						// Get all the deals
						var $container = $(this).closest('.add-form-section');

						$container
								.html('<img src="'
										+ browser.extension
												.getURL("images/f-loader.gif")
										+ '" style="height: 8px;width: 12px;padding: 10px;">');

						_EB_Request_Processor(
								"/api/panel/deals",
								{
									'page_size' : 200
								},
								"POST",
								function(data) {

									if (!data || data.length == 0) {
										$container
												.html("<div class='eb-error'>You do not have any existing deals to add to this contact</div>");
										setTimeout(function() {
											$container.html("");
										}, 5000);
									} else {
										$container
												.html(EngageBayGetAndCompileTemplate(
														"contact-add-deal-form-view",
														data));
									}

								}, function(error) {
									$container.html(error);
								});

					});

	$contactView.on('click', '.save-add-deal', function(e) {

		e.stopPropagation();

		if ($(this).attr('disabled'))
			return;

		// Get all the deals
		var $that = $(this);
		var $container = $that.closest('.contact-options-toggle');

		var selectedDealId = $container.find('select.add-deal-input').val();
		// console.log("selectedDealId", selectedDealId);
		if (!selectedDealId) {

			$container.find('.error').html(
					"<div class='message'>All fields are required.</div>");
			setTimeout(function() {
				$container.find('.error').html("");
			}, 6000);

			return;
		}

		$(this).attr('disabled', true);
		// Ghanshyam
		_EB_Request_Processor("/api/browser-extension/contact/"
				+ subscriberDetails.id + "/add-deal-to-contact", {
			'dealId' : selectedDealId
		}, "POST", function(data) {
			$container.trigger('loadDeals');
		}, function(error) {
			console.log(error);
			$container.find('.error').html(
					"<div class='message'>" + error + "</div>");
			setTimeout(function() {
				$container.find('.error').html("");
			}, 6000);
			$(this).removeAttr('disabled');
		});

	});

	$contactView
			.on(
					'click',
					'.add-task',
					function(e) {

						e.stopPropagation();

						// Get all the deals
						var $container = $(this).closest('.add-form-section');

						$container
								.html('<img src="'
										+ browser.extension
												.getURL("images/f-loader.gif")
										+ '" style="height: 8px;width: 12px;padding: 10px;">');

						_EB_Request_Processor(
								"/get-all",
								{
									'page_size' : 200
								},
								"POST",
								function(data) {

									if (!data || data.length == 0) {
										$container
												.html("<div class='eb-error'>You do not have any existing task to add to this contact</div>");
										setTimeout(function() {
											$container.html("");
										}, 5000);
									} else {
										$container
												.html(EngageBayGetAndCompileTemplate(
														"contact-add-task-form-view",
														data));
									}

								}, function(error) {
									$container.html(error);
								},undefined,"/jsapi/rest");

					});

	$contactView.on('click', '.save-add-task', function(e) {

		e.stopPropagation();

		// Get all the deals
		var $that = $(this);
		var $container = $that.closest('.contact-options-toggle');

		if ($(this).attr('disabled'))
			return;

		var selectedDealId = $container.find('select.add-task-input').val();
		// console.log("selectedDealId", selectedDealId);
		if (!selectedDealId) {

			$container.find('.error').html(
					"<div class='message'>All Fields are required.</div>");
			setTimeout(function() {
				$container.find('.error').html("");
			}, 6000);
			return;

		}

		$(this).attr('disabled', true);
		// ghanshyam
		_EB_Request_Processor("/api/browser-extension/contact/"
				+ subscriberDetails.id + "/add-task-to-contact", {
			'taskId' : selectedDealId
		}, "POST", function(data) {
			$container.trigger('loadTasks');
		}, function(error) {
			console.log(error);
			$container.find('.error').html(
					"<div class='message'>" + error + "</div>");
			setTimeout(function() {
				$container.find('.error').html("");
			}, 6000);
			$(this).removeAttr('disabled');
		});

	});

	$contactView.on('click', '.add-note', function(e) {

		e.stopPropagation();

		// Get all the deals
		var $container = $(this).parent();

		$container.html(EngageBayGetAndCompileTemplate(
				"contact-add-note-form-view", {}));

	});

	$contactView.on('click', '.save-add-note', function(e) {

		e.stopPropagation();

		if ($(this).attr('disabled'))
			return;

		// Get all the deals
		var $that = $(this);
		var $container = $that.closest('.contact-options-toggle');

		var subject = $container.find('.add-note-subject').val();
		var content = $container.find('.add-note-content').val();
		if (!content || !subject) {
			$container.find('.error').html(
					"<div class='message'>All field are required.</div>");
			setTimeout(function() {
				$container.find('.error').html("");
			}, 6000);
			return;
		}

		$(this).attr('disabled', true);

		var payload = {
			'parentId' : subscriberDetails.id,
			'content' : content,
			'subject' : subject
		};

		_EB_Request_Processor("/api/panel/notes", payload, "POST",
				function(data) {
					$container.trigger('loadNotes');
				}, function(error) {
					console.log(error);
					$container.find('.error').html(
							"<div class='message'>Something went wrong!</div>");
					setTimeout(function() {
						$container.find('.error').html("");
					}, 6000);
					$(this).removeAttr('disabled');
				}, "application/json");

	});

	function loadRespectiveView($contentTemplace, subscriberDetails, url, type,
			templateName, successCallback) {

		$contentTemplace.html('<img src="'
				+ browser.extension.getURL("images/f-loader.gif")
				+ '" style="height: 8px;width: 12px;padding: 10px;">');

		_EB_Request_Processor(url, {}, type,
				function(data) {

					var $template = $(EngageBayGetAndCompileTemplate(
							templateName, data));

					$contentTemplace.html($template);

				}, function(error) {
					$contentTemplace.html(error);
				});

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
	var $elem = $(el);
	$(".tab-container .nav-tabs  li a", $elem).click(function(e) {
		e.preventDefault();
		var currentElement = $(e.currentTarget).attr("data-href")
		$(".tab-container .nav-tabs  li").removeClass("active");
		$(".tab-content .tab-pane.active").removeClass("active");
		$(e.currentTarget).parent().addClass("active");
		$("#" + currentElement).addClass("active");
	});
}