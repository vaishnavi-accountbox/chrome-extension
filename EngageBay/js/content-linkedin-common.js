var LinkedInUserData = {};
$(function() {

	/*
	 * setTimeout(function() { var profileId =
	 * window.location.href.replace('www.', '') .replace('linkedin.com/in',
	 * '').replace('https://', '').replace('http://', '').split('/').join(
	 * '').split('#')[0].split('?')[0];
	 * 
	 * fetchLinkedInProfileData(profileId, function(data) {
	 * LinkedInUserData[profileId] = data; });
	 *  }, 3000)
	 */
});

function getProfileDetailsFromDom(profileId) {

	var data_link = {};
	var website_from_finder;

	if ($("#lite-nav").length > 0 || $("#primary-nav").length > 0) {

		// Image source
		data_link.image_src = data_link.image_src
				|| $(".member-photo-container img").attr("src");

		// Profile title
		var name = $(".member-description .member-name").text();
		try {
			var sepText = $(".member-description .member-name .dot-separator")
					.text().trim();
			name = name.split(sepText).join('').trim();
		} catch (e) {
		}

		if (name) {
			var nameArray = name.split(" ");
			data_link.first_name = nameArray[0];
			if (nameArray[1])
				data_link.last_name = nameArray[1];
		}

		// Profile title
		var member_title = $(".member-headline").text();
		if (member_title) {
			data_link.role = member_title;
		} else {
			member_title = $(".member-description .medium").text();
			data_link.role = member_title;
		}

		var member_data = $(".member-meta").length;
		member_data = parseInt(member_data) + 1;
		var html_content = $(".member-meta:nth-child(" + member_data + ")")
				.html();
		if (html_content) {
			html_content = html_content.split("<span")[0];
		} else {
			html_content = $(".member-description dd:last-child").html().split(
					"<span")[0];
		}

		var link_location = html_content.split(",");
		if (link_location.length > 2) {
			data_link.city = link_location[0];
			data_link.state = link_location[1];
			data_link.country = link_location[2];
		}
		if (link_location.length == 2) {
			data_link.city = link_location[0];
			data_link.state = link_location[1];
		}

		if (link_location.length == 1) {
			data_link.country = link_location[0];
		}

		var web_site = null;
		$("#contact-list")
				.find(".contact-info")
				.each(
						function(i) {
							var content_html = $(this).text();
							if (content_html
									&& content_html.indexOf("Email") > -1) {
								var email = $(this).find(".contact-value")
										.text();
								if (email) {
									data_link.email = email;
								} else {
									data_link.email = $(this).find(
											".medium:nth-child(2)").text();
								}
							} else {
								var email_from_finder = $(".email-from-finder")
										.text();
								if (email_from_finder) {
									data_link.email = email_from_finder;
									website_from_finder = email_from_finder
											.split("@")[1];
								}
							}
							if (content_html
									&& content_html.indexOf("Phone") > -1) {
								var phone = $(this).find(".contact-value")
										.text();
								if (phone) {
									data_link.phone = phone;
								} else {
									data_link.phone = $(this).find(
											".medium:nth-child(2)").text();
								}
							}
							if (content_html
									&& content_html.indexOf("Website") > -1) {
								$(this).find("div").each(
										function(i) {
											if (web_site) {
												web_site = web_site
														+ ","
														+ $(this).find("a")
																.attr("href");
											} else {
												web_site = $(this).find("a")
														.attr("href");
											}
										});
								data_link.url = web_site;
							} else {
								if (website_from_finder) {
									data_link.url = "https://"
											+ website_from_finder;
								}
							}
							if (content_html
									&& content_html.indexOf("LinkedIn") > -1) {
								data_link.link = $(this).find("a").attr("href");
							}
						});
	} else {

		if ($('.pv-top-card__photo').length > 0)
			data_link.image_src = data_link.image_src
					|| $('.pv-top-card__photo').attr('src');

		if ($(".pv-top-card-section__photo").attr("src")) {
			var image = $(".pv-top-card-section__photo").attr("src");
			data_link.image_src = data_link.image_src || image;
		}

		if ($(".pv-top-card pv-top-card--list li:first-child").text()) {
			var nameArray = $(".pv-top-card pv-top-card--list li:first-child")
					.text().split(" ");
			data_link.first_name = nameArray[0];
			if (nameArray[1])
				data_link.last_name = nameArray[1];
		}

		if ($(".pv-top-card h2").text()) {
			var member_title = $(".pv-top-card h2").text();
			if (member_title) {
				data_link.role = member_title.trim();
			} else {
				member_title = $(".member-description .medium").text();
				data_link.role = member_title;
			}
		}

		var str;
		$('.pv-top-card--list-bullet > li:first-child').each(function() {
			var str = $(this).text();
			if (str != undefined) {
				data_link.state = (function() {
					var address, addresses;
					// address =
					// $('body').find('.pv-top-card-v3--list-bullet.t-black[1]:last-child').text();
					address = str;
					addresses = address.split(',');
					if (addresses.length > 2) {
						data_link.city = $.trim(addresses.slice(-0)[0]);
						data_link.country = $.trim(addresses.slice(-1)[0]);
						return $.trim(addresses.slice(-2)[0]);
					}
					if (addresses.length > 1) {
						data_link.country = $.trim(addresses.slice(-1)[0]);
						return $.trim(addresses.slice(-2)[0]);
					} else {
						return $.trim(addresses.slice(-1)[0]);
					}
				})();
			}
		});

		$('.pv-contact-info__contact-type').each(function(i) {
			var html = $(this).html();
			if (html.indexOf("Website") > -1) {
				$(this).find("div").each(function(i) {
					var web_site = $(this).find("a").attr("href");
					data_link.url = web_site;
				});
			}
			if (html.indexOf("Email") > -1) {
				$(this).find("div").each(function(i) {
					var web_site = $(this).find("a").text();
					data_link.email = web_site;
				});
			}
			if (html.indexOf("Profile") > -1) {
				$(this).find("div").each(function(i) {
					var web_site = $(this).find("a").attr("href");
					data_link.link = web_site;
				});
			}
			if (html.indexOf("Phone") > -1) {
				var web_site = $(this).find("a").text();
				data_link.phone = web_site;
			}
		});

	}

	if ($('.contacts-container').length > 0) {

	}

	try {
		if (data_link.url
				&& data_link.url.indexOf('linkedin.com/redir/redirect')) {
			var url = new URL(data_link.url);
			data_link.url = url.searchParams.get("url");
		}
	} catch (e) {
	}

	data_link.link = window.location.href;
	
	return formatlinkedInProfileData(data_link, profileId);

}

function fetchLinkedInProfileData(profileId, callback) {

	if (LinkedInUserData[profileId]) {
		console.log('linkedin data', LinkedInUserData[profileId]);
		callback(LinkedInUserData[profileId]);
		return;
	}
	
	var data_link = getProfileDetailsFromDom(profileId);

	// Send request to server to fetch hidden details
	$
			.when(
					getAJAXReq('/voyager/api/identity/profiles/' + profileId
							+ '/profileContactInfo', 'GET', {}),
					getAJAXReq('/voyager/api/identity/profiles/' + profileId
							+ '/profileView', 'GET', {}))
			.done(
					function(result1, result2) {

						try {

							/*
							 * if(result3.indexOf('success') > -1){ try { var
							 * data3 = result3[0]; data_link.company =
							 * data3.elements[0].name; } catch (e) { } }
							 */

							if (result1.indexOf('success') > -1) {
								var data1 = result1[0];

								if (data1.emailAddress)
									data_link.email = data1.emailAddress;

								if (data1.websites && data1.websites.length > 0)
									data_link.url = data1.websites[data1.websites.length - 1].url;

								if (data1.twitterHandles
										&& data1.twitterHandles.length > 0)
									data_link.twitter_url = "https://twitter.com/"
											+ data1.twitterHandles[data1.twitterHandles.length - 1].name;

							}

							if (result2.indexOf('success') > -1) {

								try {
									var company = result2[0].positionGroupView.elements[0].name;
									if (!company)
										company = result2[0].positionView.elements[0].companyName;

									if (company)
										data_link.company = company;
								} catch (e) {
								}

								var data2 = result2[0].profile;

								if (data2.firstName)
									data_link.first_name = data2.firstName;

								if (data2.lastName)
									data_link.last_name = data2.lastName;

								if (data2.miniProfile
										&& data2.miniProfile.occupation)
									data_link.role = data2.miniProfile.occupation;

								if (data2.geoCountryName)
									data_link.country = data2.geoCountryName;

								if (data2.geoCountryName)
									data_link.country = data2.geoCountryName;

								if (data2.geoLocationName) {
									var link_location = data2.geoLocationName
											.split(",");
									data_link.city = link_location[0];
									if (link_location.length > 1)
										data_link.state = link_location[1];
								}

								try {
									if (data2.miniProfile
											&& data2.miniProfile.picture
											&& data2.miniProfile.picture['com.linkedin.common.VectorImage']) {
										var picture = data2.miniProfile.picture['com.linkedin.common.VectorImage'];
										data_link.image_src = picture.rootUrl;
										data_link.image_src += picture.artifacts[picture.artifacts.length - 1].fileIdentifyingUrlPathSegment;
									} else {
										data_link.image_src = "";
									}
								} catch (e) {
								}

							}

						} catch (e) {
						}

						LinkedInUserData[profileId] = formatlinkedInProfileData(data_link, profileId);
						console.log('linkedin data',
								LinkedInUserData[profileId]);
						callback(LinkedInUserData[profileId]);

					}).fail(function(jqXHR, textStatus) {
				callback(formatlinkedInProfileData(data_link, profileId));
			});

}

function formatlinkedInProfileData(data, vanityName) {
	try {
		data.firstName = data.first_name;
		data.lastName = data.last_name
		data.fullName = data.first_name + " " + data.last_name;
		
		data.website = data.url;
		data.addressCity = data.city;
		data.addressState = data.state;
		data.addressCountry = data.country;
		
		data.link = "https://www.linkedin.com/in/" + vanityName;
		data.url = data.link;
		data.linkedin = data.link;
		
	} catch (e) {
	}
	return data;
}