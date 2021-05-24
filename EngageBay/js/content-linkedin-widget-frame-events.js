/*function getWindowParentUrl() {
	var isInIframe = (parent !== window), parentUrl = null;
	if (isInIframe) {
		parentUrl = document.referrer;
	}
	return parentUrl;
}*/

function initEngagebay() {

	$('body').removeClass('eb-validated');
	$('.syncToEngagebay').remove();

	load();

	function load() {

		loadEngagebay();

		setTimeout(function() {

			if (!$('body').hasClass('eb-validated')
					|| $('.syncToEngagebay').length == 0) {
				load();
			}

		}, 1000);

	}
}

function loadEngagebay() {

	var host_location = window.location.host;
	console.log('host_location', host_location);
	// var parenturl = getWindowParentUrl();
	// console.log("parenturl", parenturl);

	if (window.location.pathname.indexOf("/search/") == 0) {
		if ($(".engagebay-resources").length == 0) {
			$(
					"<style type='text/css' class='engagebay-resources'>.syncToEngagebay.disabled{opacity:0.7;} .syncToEngagebay.disabled .loader{display:inline;}.syncToEngagebay .loader{display:none;height: 10px;width: auto;vertical-align: middle;padding-left: 5px;}</style>")
					.appendTo("head");
			$(
					"<style type='text/css' class='engagebay-resources'>#global-nav-search {padding: 10px !important;} .pv-profile-wrapper .profile-view-grid{margin-top:70px !important;} .search-filters-bar.display-flex, .message, #self-profile-settings-gear, #secondary-nav-list, .pv-s-profile-actions, .ad-banner-container, .message-anywhere-button, .profile-actions__overflow, .search-s-rail.right-rail, .global-footer, .extended-nav.nav-main-container nav, #ember33.ember-view .container-with-shadow.p3, .msg-overlay-list-bubble, #launchpad-wormhole{display: none !important;} .search-form__go-back-button,.sub-nav,.search-form__open-filters-button{display:none !important;} #_engagebay_extn_linkedinengagebay_iframe{ display:none !important;} </style>")
					.appendTo("head");
			$(
					"<style type='text/css' class='engagebay-resources'>.engagebayContactAdd, .global-nav__nav, .global-nav__primary-items, .scaffold-layout-toolbar, .scaffold-layout__ad, .global-footer, .msg-overlay-container { display: none !important; } </style>")
					.appendTo("head");
		}
		return;
	}

	setTimeout(
			function() {

				if (host_location.indexOf("linkedin") > -1) {

					if ($('body').hasClass('eb-validated')
							&& $('.syncToEngagebay').length > 0)
						return;

					$('.syncToEngagebay').remove();

					$('body').addClass('eb-validated');

					setInterval(function() {
						if ($('.snap-search-bar').length > 0
								&& window.location.href
										.indexOf('linkedin.com/in/') > 0) {
							window.location.reload();
						}
					}, 1000);

					if ($(".engagebay-resources").length == 0) {
						$(
								"<style type='text/css' class='engagebay-resources'>.syncToEngagebay.disabled{opacity:0.7;} .syncToEngagebay.disabled .loader{display:inline;}.syncToEngagebay .loader{display:none;height: 10px;width: auto;vertical-align: middle;padding-left: 5px;}</style>")
								.appendTo("head");
						$(
								"<style type='text/css' class='engagebay-resources'>#global-nav-search {padding: 10px !important;} .pv-profile-wrapper .profile-view-grid{margin-top:70px !important;} .search-filters-bar.display-flex, .message, #self-profile-settings-gear, #secondary-nav-list, .pv-s-profile-actions, .ad-banner-container, .message-anywhere-button, .profile-actions__overflow, .search-s-rail.right-rail, .global-footer, .extended-nav.nav-main-container nav, #ember33.ember-view .container-with-shadow.p3, .msg-overlay-list-bubble, #launchpad-wormhole{display: none !important;} .search-form__go-back-button,.sub-nav,.search-form__open-filters-button{display:none !important;} #_engagebay_extn_linkedinengagebay_iframe{ display:none !important;} </style>")
								.appendTo("head");
						$(
								"<style type='text/css' class='engagebay-resources'>.engagebayContactAdd, .global-nav__nav, .global-nav__primary-items, .scaffold-layout-toolbar, .scaffold-layout__ad, .global-footer, .msg-overlay-container { display: none !important; } </style>")
								.appendTo("head");
					}

					$("#primary-nav").css({
						"bottom" : "inherit"
					});

					$("#secondary-nav").css({
						"display" : "none"
					});

					$('head').find('base').remove();
					// $('head').prepend('<base target="_blank" />');
					$("#core-nav").css({
						"height" : "0px"
					});
					$("#core-nav").hide();
					$(".nav-main").hide();
					$(".sub-nav").hide();
					$(".authentication-outlet").css({
						"margin-top" : "0px"
					});
					$(".header-container").css({
						"top" : "0px"
					});
					$(".search-form__open-filters-button").hide();
					$(".search-form__go-back-button").hide;

					var text = $("body").find("#profile-wrapper");
					$(".toast-wormhole").hide();

					if (text.length != 0) {

						var templateHTML1 = '<span style="color:white;float: left;margin-top: 3px;padding-left: 10px;"><img src="'
								+ browser.extension
										.getURL("/images/engagebay-logo.png")
								+ '" style="float: left;height: 30px;width: auto;"></span>';
						var templateHTML2 = '<div class="syncToEngagebay" style="display: inline-block; padding: 14px 12px; background: rgb(107, 72, 140); cursor: pointer; font-size: 14px; font-weight: 500; width: 100%; text-align: center; color: white; margin-top: -7px;">Sync Details to EngageBay <img class="loader" src="'
								+ browser.extension
										.getURL("/images/f-loader.gif")
								+ '" ></div>';

						$("#inbug-nav-item").html(templateHTML1);
						$("#profile-wrapper").prepend(templateHTML2);
						$(".pv-profile-sticky-header").css({
							"display" : "none"
						});

						$(".header-content").find(".snap-search-bar").find("a")
								.remove();
						$(".header-content").find(".snap-search-bar").html(
								templateHTML2);

						$(".header-content").css({
							"text-align" : "center"
						});
						$('body').find('a').removeClass('ember-view').addClass(
								'tap-target').attr('target', '_blank');
						$("#core-nav").css({
							"display" : "none"
						});
						$(".collapsable-sticky-header").css({
							"height" : "37px"
						});
						$(".pv-top-card-section__profile-photo-container").css(
								{
									"margin-top" : "10px"
								});

					} else {

						var templateHTML1 = '<span style="color:white;float: left;margin-top: 12px;padding-left: 10px;"><img src="'
								+ browser.extension
										.getURL("/images/engagebay-inverse.png")
								+ '" style="float: left;height: 18px;width: auto;"></span><span class="search-function" style="color: white;cursor:pointer;right: 34px;top: 14px;position: absolute;"><li-icon style="height: 20px;width: 20px;" aria-hidden="true" type="search-icon" size="small"><svg viewBox="0 0 24 24" width="24px" height="24px" x="0" y="0" preserveAspectRatio="xMinYMin meet" class="artdeco-icon" ><g class="small-icon" style="fill-opacity: 1"><path d="M14,12.67L11.13,9.8A5,5,0,1,0,9.8,11.13L12.67,14ZM3.88,7A3.13,3.13,0,1,1,7,10.13,3.13,3.13,0,0,1,3.88,7Z"></path></g></svg></li-icon></span>';
						var templateHTML2 = '<div class="syncToEngagebay" style="display: inline-block;padding: 14px 12px;margin-top: 0px;background: #f6f6f6;cursor: pointer;font-size: 14px;font-weight: 500;width: 100%;">Sync Details to EngageBay</div>';

						if ($("#lite-nav").is(":visible")) {
							$("#lite-nav")
									.css(
											{
												"background" : "linear-gradient(to right, #6a3b8d, #6a3b8d)"
											});
							$("#lite-nav").html(templateHTML1);
							$("#lite-nav").after(templateHTML2);
						}
						if ($(".nav_v2").is(":visible")) {
							$("#primary-nav")
									.css(
											{
												"background" : "linear-gradient(to right, #6a3b8d, #6a3b8d)"
											});
							$("#primary-nav").html(templateHTML1);
							$("#primary-nav").after(templateHTML2);
							$('.cover-image').css({
								'padding-bottom' : '30%'
							});
						}
					}

					$(window).scroll(
							function() {
								$(".pv-browsemap-section").css({
									"margin-left" : "0px",
									"padding-left" : "0px"
								});
								$(".toast-wormhole").hide();
								$(".collapsable-sticky-header").addClass(
										"show-header");
								$(".search-form__open-filters-button").hide();
								$(".search-form__go-back-button").hide();
								var text_find = $("body").find(
										"#profile-wrapper");
								if (text_find.length != 0) {
									$('body').find('a').removeClass(
											'ember-view')
											.addClass('tap-target').attr(
													'target', '_blank');
									if ($(document).scrollTop() > 100) {
										$(".syncToEngagebay").css({
											"color" : "#006097"
										});
									} else {
										$(".syncToEngagebay").css({
											"color" : "white"
										});
									}
								} else {
									setListenerEvent();
								}
							});

					setListenerEvent();

					$("#core-nav").css({
						"height" : "0px"
					});
					$("#core-nav").hide();
					$(".nav-main").hide();
					$(".sub-nav").hide();
					$(".authentication-outlet").css({
						"margin-top" : "0px"
					});
					$(".header-container").css({
						"top" : "0px"
					});
					$(".search-form__open-filters-button").hide();
					$(".search-form__go-back-button").hide;

					setLoadContentEventListener();

					$(".connect").click(function(e) {
						e.preventDefault();
						e.stopPropagation();
						$(".connect").attr("data-artdeco-is-focused", "true");
						window.open(window.location.href, '_blank');
					});

					searchFieldActions();
				}
				function searchFieldActions() {

					/*
					 * $(".ember-text-field").keyup(function(event){
					 * $(".type-ahead-results").hide();
					 * $(".type-ahead-results").addClass("search-function-ul").removeClass("type-ahead-results").removeClass("ember-view");;
					 * $(".search-function-ul").css({"height":"500px","background-color":"whitesmoke"});
					 * $(".search-function-ul").html("");
					 * $(".type-ahead-wrapper").append("<div
					 * class='wrapper-class'
					 * style='height:500px;background-color:whitesmoke;'></div>");
					 * if(event.keyCode == 13){ event.preventDefault();
					 * event.stopPropagation(); var search_val =
					 * $(".ember-text-field").val();
					 * window.location.replace("https://www.linkedin.com/search/results/people/?keywords="+search_val.trim()+"&origin=GLOBAL_SEARCH_HEADER"); }
					 * $(".type-ahead-cancel").html("OK");
					 * $(".type-ahead-cancel").click(function(e){
					 * event.preventDefault(); event.stopPropagation(); var
					 * search_val = $(".ember-text-field").val();
					 * window.location.replace("https://www.linkedin.com/search/results/people/?keywords="+search_val.trim()+"&origin=GLOBAL_SEARCH_HEADER");
					 * }); }); $( ".ember-text-field").focus(function() {
					 * $(".type-ahead-cancel").html("OK"); //
					 * $(".type-ahead-cancel").css({"border":".5px solid
					 * #FFF","padding":"4px"});
					 * $(".type-ahead-cancel").click(function(e){
					 * event.preventDefault(); event.stopPropagation(); var
					 * search_val = $(".ember-text-field").val();
					 * window.location.replace("https://www.linkedin.com/search/results/people/?keywords="+search_val.trim()+"&origin=GLOBAL_SEARCH_HEADER");
					 * }); $(".type-ahead-results").hide();
					 * $(".type-ahead-results").addClass("search-function-ul").removeClass("type-ahead-results").removeClass("ember-view");;
					 * $(".search-function-ul").css({"height":"500px","background-color":"whitesmoke"});
					 * $(".search-function-ul").html("");
					 * $(".type-ahead-wrapper").append("<div
					 * class='wrapper-class'
					 * style='height:500px;background-color:whitesmoke;'></div>");
					 * });
					 */
				}
				function setListenerEvent() {

					$(".search-form__open-filters-button").css({
						"display" : "none"
					});
					$(".search-form__go-back-button").css({
						"display" : "none"
					});
					if ($(".search-no-results__message").is(":visible")) {
						$(".search-form__open-filters-button").css({
							"display" : "none"
						});
						$(".search-form__go-back-button").css({
							"display" : "none"
						});
					} else {
						$(".search-form__open-filters-button").hide();
						$(".search-form__go-back-button").hide();
						if ($(".search-result__wrapper").is(":visible")) {
							$(".search-form__open-filters-button").css({
								"display" : "none"
							});
							$(".search-form__go-back-button").css({
								"display" : "none"
							});

							$(".search-result__wrapper")
									.click(
											function(e) {
												e.preventDefault();
												e.stopPropagation();
												var href_link = $(this).attr(
														"href");
												// closeAndCreateANewTab(href_link);
												history.replaceState(null,
														null, href_link);
												window.location
														.replace("https://www.linkedin.com"
																+ href_link);
											});

							// desktop view
							$(".search-result__wrapper a").click(function(e) {
								e.preventDefault();
								e.stopPropagation();
								var href_link = $(this).attr("href");
								closeAndCreateANewTab(href_link);
								// history.replaceState(null, null, href_link);
								// window.location.replace("https://www.linkedin.com"+href_link);
							});
							setInterval(
									function() {

										$(".search-result__wrapper")
												.click(
														function(e) {
															e.preventDefault();
															e.stopPropagation();
															var href_link = $(
																	this).attr(
																	"href");
															// closeAndCreateANewTab(href_link);
															history
																	.replaceState(
																			null,
																			null,
																			href_link);
															window.location
																	.replace("https://www.linkedin.com"
																			+ href_link);
														});
										$(".search-result__wrapper a")
												.click(
														function(e) {
															e.preventDefault();
															e.stopPropagation();
															var href_link = $(
																	this).attr(
																	"href");
															closeAndCreateANewTab(href_link);
															// history.replaceState(null,
															// null, href_link);
															// window.location.replace("https://www.linkedin.com"+href_link);
														});
									}, 1000);
						} else {
							setTimeout(function() {
								setListenerEvent();
							}, 1000);
						}
					}
				}

				function setLoadContentEventListener() {
					$(".syncToEngagebay").off('click');
					$(".syncToEngagebay").on('click', function(e) {

						if ($(this).hasClass('disabled'))
							return;

						e.preventDefault();
						e.stopPropagation();

						$(this).addClass('disabled');

						sendContentToEngageBay();

						/*
						 * if(true) return;
						 * 
						 * if(!$(".pv-contact-info__ci-container").is(":visible")){
						 * 
						 * 
						 * if(!$("#lite-nav").is(":visible") &&
						 * !$("#primary-nav").is(":visible")){
						 * 
						 * 
						 * //$("html, body").addClass( "shared-modal-overlay
						 * ember-view" ); $("html, body").animate({ scrollTop:
						 * document.body.scrollHeight }, "slow"); function
						 * needtoscroll(num1){ if($('#ember'+num1+'').length ==
						 * 0) { //it doesn't exist num1++; } $('html,
						 * body').animate({ scrollTop: $('#ember'+num1+'').top },
						 * 1000); } var num1 = 42; function needtowait(i) { if
						 * (i < 0) { sendContentToEngageBay(); return; }
						 * setTimeout(function () { needtowait(--i);
						 * needtoscroll(num1); num1++; }, 2000); }
						 * needtowait(12); }else{ sendContentToEngageBay(); }
						 * }else{ sendContentToEngageBay(); }
						 */

					});

					$(".search-function").off('click');
					$(".search-function")
							.on(
									'click',
									function(e) {
										e.preventDefault();
										e.stopPropagation();
										window.location
												.replace("https://www.linkedin.com/search/results/people/?keywords=&origin=GLOBAL_SEARCH_HEADER");
									});

					$("#view-options-icon").off('click');
					$("#view-options-icon").on('click', function(e) {
						$(".options-list").css({
							"cursor" : "pointer"
						});
					});
				}

				/*
				 * Extrach data, and send to engabeay parent window
				 */
				function sendContentToEngageBay() {

					$("html, body").removeAttr("style")
					$("#core-nav").css({
						"display" : "none"
					});

					var profileId = window.location.href.replace('www.', '')
							.replace('linkedin.com/in', '').replace('https://',
									'').replace('http://', '').split('/').join(
									'').split('#')[0].split('?')[0];

					fetchLinkedInProfileData(profileId, postMessage);

					function postMessage(data_link) {

						var postMessageData = {};
						postMessageData.event_name = "CONTACT_DATA_SYNC_FROM_LINKEDIN";
						postMessageData.event_data = data_link;
						postMessageData.action = 'linkedin_sync_data_received';

						// window.parent.postMessage(postMessageData,"*");

						chrome.runtime.sendMessage({
							event : 'post_message_to_tab',
							tab_id : parentTabId,
							data : postMessageData
						}, function(response) {
							chrome.runtime.sendMessage({
								event : 'close_tab',
								tab_id : currentTabId
							}, function(response) {

							});
						});

					}

				}

			}, 1000);

}

var subTabCreated = false;
function closeAndCreateANewTab(path) {

	history.replaceState(null, null, path);
	window.location.replace("https://www.linkedin.com" + path);

	if (true)
		return;

	if (subTabCreated)
		return;

	subTabCreated = true;

	chrome.runtime.sendMessage({
		event : 'open_new_popup_tab1',
		link : "https://www.linkedin.com" + path,
		parent_id : parentTabId
	}, function(response) {
		console.log(response);

		/*
		 * chrome.runtime.sendMessage({event: 'close_tab', tab_id : currentTabId },
		 * function (response) { });
		 */

	});

	chrome.runtime.sendMessage({
		event : 'close_tab',
		tab_id : currentTabId
	}, function(response) {
	});

}

var currentTabId, parentTabId;
$(document).ready(function() {

	// setInterval(function() {
	// loadEngagebay();
	// }, 2000);
	// loadEngagebay();

	chrome.runtime.sendMessage({
		event : 'tab_created_by_extension'
	}, function(response) {

		if (response.status) {
			currentTabId = response.id;
			parentTabId = response.parent_id;
			initEngagebay();
		}
	});

});

function getJSessionId() {
	var jsId = document.cookie.match(/JSESSIONID=[^;]+/);
	if (jsId != null) {
		if (jsId instanceof Array)
			jsId = jsId[0].substring(11);
		else
			jsId = jsId.substring(11);
	}
	jsId = jsId.split('"').join('');
	return jsId;
}

function getAJAXReq(url, type, data) {

	return $
			.ajax({
				url : url,
				data : data,
				method : type,
				dataType : 'json',
				// dataType: 'application/vnd.linkedin.normalized+json+2.1'
				beforeSend : function(xhr) {
					xhr
							.setRequestHeader('x-li-page-instance',
									"urn:li:page:d_flagship3_profile_view_base_contact_details");
					xhr
							.setRequestHeader(
									'x-li-track',
									'{"clientVersion":"1.3.3430","osName":"web","timezoneOffset":1,"deviceFormFactor":"DESKTOP","mpName":"voyager-web"}');
					xhr.setRequestHeader('x-restli-protocol-version', '2.0.0');
					xhr.setRequestHeader('csrf-token', getJSessionId());
				}
			});

}
