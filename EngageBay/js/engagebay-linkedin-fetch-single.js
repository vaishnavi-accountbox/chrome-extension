var MutationObserver = window.MutationObserver || window.WebKitMutationObserver
		|| window.MozMutationObserver;
var body = document.querySelector('body');
var hasAddedSingleContacttoEb = false;
function createSingleFetchElement() {

	// $('.engagebayContactAdd').remove();

	var buttond = '<button id="createcontactsingle" type="button" class="btn primary-btn engagebayContactAdd" style="background-color:#f2603e;border: 1px solid #f2603e;color: #fff;vertical-align:sub;font-weight: 600;border-radius: 2px;cursor:pointer;padding: 8px 10px;line-height: 1;margin-left: 8px;"> <span class="text" style="font-size:14px;">Add to EngageBay</span></button>';
	$('.pvs-profile-actions').each(function() {
		if ($(this).next('.engagebayContactAdd').length == 0 && !hasAddedSingleContacttoEb)
			$(this).after(buttond);
	});

	/*
	 * var htmlelmnt = $('ul.pv-top-card-v3--experience-list')[0]; // Don't add
	 * button if exists if(htmlelmnt == undefined || $(".engagebayContactAdd",
	 * htmlelmnt)[0]) return; // 'Add to engagebay CRM' button added at the end
	 * //htmlelmnt.insertAdjacentHTML('beforeend',buttond);
	 * //htmlelmnt.querySelector('.engagebayContactAdd').addEventListener('click',addContactCall100,true);
	 * htmlelmnt.insertAdjacentHTML('afterend',buttond);
	 * //$(htmlelmnt).css("display","inline-block");
	 * document.querySelector('.engagebayContactAdd').addEventListener('click',addContactCall100,true);
	 * var name = $(".contact-see-more-less").attr("data-control-name"); if(name ==
	 * "contact_see_more"){ $(".contact-see-more-less").click(); }
	 */
}

// Refactored the code
function contactInfo() {

	createSingleFetchElement();

	/*
	 * var linkedin = (function() { var id; var id1 = window.location.href; var
	 * id2 = $('body').find('.pv-contact-info__contact-type.ci-vanity-url'); if
	 * (id2.length > 0) { var content = id2[0]; var idcontent =
	 * content.getElementsByClassName('pv-contact-info__contact-item'); if
	 * (idcontent.length > 0) { return idcontent[0].innerText; } } else { return
	 * id1; } })(); if (linkedin != undefined || linkedin != null) {
	 * createSingleFetchElement();
	 * if($(".pv-top-card-section__body").find(".engagebayContactAdd") !=
	 * undefined){ var btnlength =
	 * $(".pv-top-card-section__body").find(".engagebayContactAdd").length;
	 * if(btnlength > 1){
	 * $(".pv-top-card-section__body").find(".engagebayContactAdd")[1].remove(); } } }
	 */
}

function saveEachContactengagebay100(properties) {
	var contact = {};
	contact.contact_company_id = null;
	var props = [];
	props = properties;
	contact.properties = props;
	var tags_input = JSON.stringify([ "LinkedIn" ]);
	contact.tags = [ "LinkedIn" ];
	contact.tagsWithTime = [];
	contact.type = 'PERSON';
	// Add Source
	contact.source = 'LINKEDIN';

	_EB_Request_Processor("/api/browser-extension/sync-contact", contact, "POST",
			function(response) {
				$('.engagebayContactAdd').text('Added to EngageBay');
				hasAddedSingleContacttoEb = true;
			}, function(err) {
				alert("Error while adding the contact.");
				$('.engagebayContactAdd').remove();
				contactInfo();
			}, "application/json");

	/*
	 * _EB_Request_Processor( "/api/browser-extension/add-contact", contact,
	 * "POST", function(resp) {
	 * document.getElementById('.engagebayContactAdd').text('Added to
	 * EngageBay'); // var htmlelmnt =
	 * $('div.pv-top-card-v2-section__actions.mt2')[0]; // var buttond = '<input
	 * type="button" id=".engagebayContactAdd" // value="Contact Added to
	 * EngageBay" class="save btn btn-sm // btn-primary _engagebay_save_"
	 * style="padding: 5px // 10px;font-size: 12px;line-height:
	 * 2.5;border-radius: // 3px;background: #5cb85c;border: 0px;color: #fff;" //
	 * disabled="disabled">'; // var buttond = '<span id=".engagebayContactAdd"
	 * style="color:green;padding-left: 5px;">Contact added to EngageBay</span>'; //
	 * htmlelmnt.insertAdjacentHTML('beforeend',buttond); //
	 * htmlelmnt.insertAdjacentHTML('afterend', buttond); //
	 * $(htmlelmnt).css("display", "inline-block"); }, function(err) {
	 * alert(err); document.getElementById('.engagebayContactAdd').remove();
	 * contactInfo(); }, "application/x-www-form-urlencoded");
	 */
}

function createContactFormate(linkedinData) {

	console.log('linkedinData = ', linkedinData);

	var contact = {};
	contact.contact_company_id = null;
	var props = [];

	if (linkedinData.image_src)
		props.push({
			name : 'image',
			value : linkedinData.image_src,
			type : 'SYSTEM'
		});

	if (linkedinData.role)
		props.push({
			name : 'role',
			value : linkedinData.role,
			type : 'SYSTEM'
		});

	if (linkedinData.first_name) {
		props.push({
			name : 'name',
			value : linkedinData.first_name,
			type : 'SYSTEM'
		});
	}

	if (linkedinData.last_name) {
		props.push({
			name : 'last_name',
			value : linkedinData.last_name,
			type : 'SYSTEM'
		});
	}

	if (linkedinData.email) {
		props.push({
			name : 'email',
			value : linkedinData.email,
			type : 'SYSTEM',
			subtype : 'primary'
		});
	}

	if (linkedinData.phone) {
		props.push({
			name : 'phone',
			value : linkedinData.phone,
			type : 'SYSTEM',
			subtype : 'other'
		});
	}

	if (linkedinData.url) {
		props.push({
			name : 'website',
			value : linkedinData.url,
			type : 'SYSTEM',
			subtype : 'URL'
		});
	}

	if (linkedinData.link) {
		props.push({
			name : 'website',
			value : linkedinData.link,
			type : 'SYSTEM',
			subtype : 'LINKEDIN'
		});
	}

	if (linkedinData.twitter_url) {
		props.push({
			name : 'website',
			value : linkedinData.twitter_url,
			type : 'SYSTEM',
			subtype : 'TWITTER'
		});
	}

	if (linkedinData.city || linkedinData.state || linkedinData.country) {

		var address = {};

		if (linkedinData.city) {
			address.city = linkedinData.city;
			props.push({
				name : 'city',
				value : linkedinData.city,
				type : 'SYSTEM'
			});
		}

		if (linkedinData.state) {
			address.state = linkedinData.state;
			props.push({
				name : 'state',
				value : linkedinData.state,
				type : 'SYSTEM'
			});
		}

		if (linkedinData.country) {
			address.country = linkedinData.country;
			props.push({
				name : 'country',
				value : linkedinData.country,
				type : 'SYSTEM'
			});
		}

		props.push({
			name : 'address',
			value : JSON.stringify(address),
			type : 'SYSTEM'
		});
	}

	saveEachContactengagebay100(props);
}

setTimeout(function() {
	
	// var x = $('body').find('.pv-top-card-v3--experience-list-item')[0];

	/*
	 * var x = $('body').find('.pv-s-profile-actions--connect')[0]; if (x !=
	 * undefined) { contactInfo();
	 * if(document.querySelector(".contact-see-more-less") != null)
	 * document.querySelector(".contact-see-more-less").click(); }
	 */

	$('body')
			.on(
					'click',
					'.engagebayContactAdd',
					function() {

						if ($(this).hasClass('disabled'))
							return;

						// Disable button
						var $eles = $('.engagebayContactAdd');
						$eles.css('pointer-events', 'none');
						$eles.text('Saving to EngageBay...');
						$eles.addClass('disabled');

						var profileId = window.location.href
								.replace('www.', '').replace('linkedin.com/in',
										'').replace('https://', '').replace(
										'http://', '').split('/').join('')
								.split('#')[0].split('?')[0];

						fetchLinkedInProfileData(profileId, function(data) {
							createContactFormate(data);
						});

					});

}, 3000);

/*
 * setInterval(function() {
 * if(document.querySelectorAll("[data-control-name='contact_see_more']")[0] !=
 * undefined)
 * document.querySelectorAll("[data-control-name='contact_see_more']")[0].click();
 * },1000);
 */

setInterval(function() {
	
	contactInfo();
	
	// if (location.href != oldLocation) {
		
		/*
		 * // do your action oldLocation = location.href var svbt =
		 * document.getElementById('.engagebayContactAdd'); var svmsg =
		 * document.getElementById('.engagebayContactAdd'); if (svbt != null) {
		 * document.getElementById('.engagebayContactAdd').remove(); } if (svmsg !=
		 * null) { document.getElementById('.engagebayContactAdd').remove(); }
		 * var x = $('div.pv-top-card-v2-section__actions.mt2')[0]; if (x !=
		 * undefined) { contactInfo();
		 * if(document.querySelector(".contact-see-more-less") != null)
		 * document.querySelector(".contact-see-more-less").click(); }
		 */
	//}
}, 1000); // check every second
