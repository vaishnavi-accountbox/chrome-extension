function getContactDetails() {
	var el = $('body');
	var result = {};

	result.profileId = (function() {
		var id;
		var id1 = window.location.href;
		var id2 = $('body')
				.find('.pv-contact-info__contact-type.ci-vanity-url');
		if (id2.length > 0) {
			var content = id2[0];
			var idcontent = content
					.getElementsByClassName('pv-contact-info__contact-item');
			if (idcontent.length > 0) {
				return idcontent[0].innerText;
			}

		} else {
			return id1;
		}
	})();

	result.tags = [ '' ];

	result.fullName = $.trim(el.find('.pv-top-card-section__name').text())
			.replace(/\(.+\)/, '');

	result.firstName = (function() {
		var names;
		names = result.fullName.split(/\s+/);
		if (names.length > 1) {
			return names[0];
		} else {
			return '';
		}
	})();
	result.lastName = (function() {
		var names;
		names = result.fullName.split(/\s+/);
		if (names.length > 1) {
			return $.trim(names.slice(1).join(' '));
		} else {
			return names[0] || '';
		}
	})();

	result.email = (function() {
		var id2 = $('body').find('.pv-contact-info__contact-type.ci-email');
		if (id2.length > 0) {
			var content = id2[0];
			var idcontent = content
					.getElementsByClassName('pv-contact-info__contact-item');
			if (idcontent.length > 0) {
				return idcontent[0].innerText;
			}

		}
		// return $.trim(val);
	})();

	result.mobile = (function() {

		var id2 = $('body').find('.pv-contact-info__contact-type.ci-phone');
		if (id2.length > 0) {
			var content = id2[0];
			var idcontent = content.getElementsByTagName("li");
			if (idcontent.length > 0) {
				var y = idcontent[0].innerText;
				if (y.indexOf(" (") > 0)
					return y.split(" (")[0];
			}

		}
		// return $.trim(val);

		return '';
	})();

	result.website = (function() {
		var id2 = $('body').find('.pv-contact-info__contact-type.ci-websites');
		if (id2.length > 0) {
			var content = id2[0];
			var idcontent = content.getElementsByTagName("a");
			if (idcontent.length > 0) {
				return idcontent[0].getAttribute("href");
			}

		}
		// return $.trim(val);

		return '';
	})();

	result.linkedin = (function() {
		var id;
		var id1 = window.location.href;
		var id2 = $('body')
				.find('.pv-contact-info__contact-type.ci-vanity-url');
		if (id2.length > 0) {
			var content = id2[0];
			var idcontent = content
					.getElementsByClassName('pv-contact-info__contact-item');
			if (idcontent.length > 0) {
				return idcontent[0].innerText;
			}

		} else {
			return id1;
		}
	})();

	var linkedinID = result.linkedin;
	if (linkedinID != null || linkedinID != undefined) {
		if (linkedinID.indexOf('www.') > 0) {
			result.linkedin = linkedinID.split("www.")[1].slice(0, -1);
		}

	}

	result.twitter = (function() {
		var id2 = $('body').find('.pv-contact-info__contact-type.ci-twitter');
		if (id2.length > 0) {
			var content = id2[0];
			var idcontent = content.getElementsByTagName("a");
			if (idcontent.length > 0) {
				return idcontent[0].getAttribute("href");
			}

		}
		// return $.trim(val);

		return '';
	})();

	result.skype = (function() {
		var id2 = $('body').find('.pv-contact-info__contact-type.ci-ims');
		if (id2.length > 0) {
			var content = id2[0];
			var idcontent = content.getElementsByTagName("li");
			if (idcontent.length > 0) {
				var y = idcontent[0].innerText;
				if (y.indexOf(" (Skype)") > 0)
					return y.split(" (Skype)")[0];
			}

		}
		// return $.trim(val);

		return '';
	})();

	result.addressCity = el.find('#location-container .locality a').text()
			.split(',')[0]
			|| el.find('#location-container .locality').text().split(',')[0];

	result.addressCountry = (function() {
		var address, addresses;
		address = el.find('#location-container .locality a').text()
				|| el.find('#location-container .locality').text();
		addresses = address.split(',');
		if (addresses.length > 1) {
			return $.trim(addresses.slice(-1)[0]);
		} else {
			return '';
		}
	})();

	result.industry = el.find('#location dd.industry').children().text() || '';

	var cmpOrgnl = $.trim(el.find('.pv-top-card-section__company').text());

	result.company = cmpOrgnl;

	var titleOrgn = $.trim(el.find('.pv-top-card-section__headline').text());

	if (titleOrgn.indexOf("at") >= 0) {
		titleOrgn = titleOrgn.split("Click to edit position title")[0];
	}

	result.role = titleOrgn;

	// result.description = $.trim(el.find('#background-experience
	// .section-item:first p.description').text());
	if (el.find('img.pv-top-card-section__image.ghost-person').length > 0) {

	} else {
		result.image = $.trim(el.find('img.pv-top-card-section__image').attr(
				'src'));
		if (result.image.length == 0) {
			var img = el.find(".presence-entity__image");
			if (img != undefined) {
				result.image = img[0].style.backgroundImage.slice(4, -1)
						.replace(/"/g, "");
			}
		}
	}
	return result;
}

function getCompanyDetails() {

	var el = $('body');
	var pathname = function(url) {
		var a;
		a = window.document.createElement('a');
		a.href = url;
		return a.pathname;
	};

	var result = {};

	result.profileId = (function() {
		var path, url;
		if (url = el.find('#nav-home a').attr('href')) {
			if (path = pathname(url).split(/\W/).filter(function(e) {
				return e;
			}).join('-')) {
				return "linkedin/" + path;
			}
		}
		return '';
	})();

	result.tags = [ 'contact clipper', 'linkedin' ];

	result.company = (function() {
		var match, text;
		text = el.find('h1.org-top-card-module__name').text();
		if (text && text.length > 0) {
			return $.trim(text);
		}
		return '';
	})();

	if (result.company.length == 0)
		result.company = $.trim(el.find('.org-top-card-summary__title').text());

	result.addressStreet = $.trim(el.find('.basic-info .street-address:first')
			.text());

	result.addressCity = $.trim(el.find('.basic-info .locality:first').text()
			.replace(/,/g, ' '));

	result.addressRegion = $.trim(el.find('.basic-info .region:first').text());

	result.addressZip = $
			.trim(el.find('.basic-info .postal-code:first').text());

	result.addressCountry = $.trim(el.find('.basic-info .country-name:first')
			.text());

	result.industry = $.trim(el.find('.basic-info .industry:first p').text());

	result.url = $.trim(el.find('.org-about-company-module__company-page-url')
			.text());

	if (result.url.length == 0)
		result.url = $
				.trim(el
						.find(
								"[data-control-name=page_details_module_website_external_link]")
						.text());

	result.description = $.trim(el.find(
			'.company-industries.org-top-card-module__dot-separated-list')
			.text());

	var linkedinID = window.location.href;
	if (linkedinID != null || linkedinID != undefined) {
		if (linkedinID.indexOf('www.') > 0) {
			result.linkedin = linkedinID.split("www.")[1];
		} else {
			if (linkedinID.indexOf('//.') > 0) {
				result.linkedin = linkedinID.split("//.")[1];
			}
		}

	}
	result.addressCity = result.addressCity.replace(/^[ ,]*/, '');
	return result;
}

chrome.runtime.onMessage
		.addListener(function(request, sender, sendResponse) {
			if (request == 'engagebay_get_contact_details') {

				if ($('body #profile-wrapper').length) {

					var profileId = window.location.href.replace('www.', '')
							.replace('linkedin.com/in', '').replace('https://',
									'').replace('http://', '').split('/').join(
									'').split('#')[0].split('?')[0];

					var sendingData;
					try {
						sendingData = JSON.parse(window.sessionStorage.getItem("PROFILE_DATA_REQUEST_DATA_"+profileId));						
					} catch (e) {
					}
					
					console.log("sendingData from storage", sendingData);
					
					if (!sendingData)
						sendingData = getProfileDetailsFromDom();

					sendResponse({
						type : 'PERSON',
						data : sendingData
					});
				}

				else if ($('div.organization-outlet').length) {
					sendResponse({
						type : 'COMPANY',
						data : getCompanyDetails()
					});
				} else if ($('div.application-outlet').length) {
					sendResponse({
						type : 'COMPANY',
						data : getCompanyDetails()
					});
				}

			}
			if (request == 'engagebay_get_contacts_details_linkedin') {
				sendResponse({
					type : 'PERSON',
					data : getContactDetailsMultipleLinkedin()
				});
			}

		});

$(function() {

	$(document).on('click', function() {
		checkAndFetchDetails(window.location.href);
	});

	// checkAndFetchDetails(window.location.href);

	chrome.runtime.sendMessage({
		event : 'get_tab_url',
	}, function(response) {
		console.log('response.url', response.url);
		checkAndFetchDetails(response.url);
	});

});

function checkAndFetchDetails(url) {

	if (!url)
		url = window.location.href;

	var profileId = url.replace('www.', '').replace('linkedin.com/in', '')
			.replace('https://', '').replace('http://', '').split('/').join('')
			.split('#')[0].split('?')[0];
	
	if(profileId.indexOf('linkedin.com') == 0)
		return;

	var key = 'PROFILE_DATA_REQUEST_DATA_' + profileId;

	if (window.sessionStorage.getItem(key)) {
		LinkedInUserData[profileId] = JSON.parse(window.sessionStorage.getItem(key));
		return;
	}

	setTimeout(function() {
		console.log('sending req', profileId);
		fetchLinkedInProfileData(profileId, function(data) {
			LinkedInUserData[profileId] = data;
			window.sessionStorage.setItem(key, JSON.stringify(data));
		});

	}, 500)

}
