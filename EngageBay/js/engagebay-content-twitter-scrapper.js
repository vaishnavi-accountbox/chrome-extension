var browser = browser || chrome; // Change chrome to browser for webextension
function getCompanyDetails(){
	
	var el=$('body');
	
	var result={};
	
	result.profileId = (function() {
      var data, err, id;
      data = el.find('#pagelet_timeline_main_column').attr('data-gt');
      try {
        id = $.parseJSON(data)['profile_owner'];
        if (!(id && id.match(/^\d+/))) {
          return null;
        }
        return "facebook/company-" + id;
      } catch (_error) {
        err = _error;
        return null;
      }
    })();
    result.tags = ['contact clipper', 'facebook'];
    
    result.companyName = $.trim(el.find('#fbTimelineHeadline img.profilePic').attr('alt'));
    
    result.phone = $.trim(el.find(".contactInfoTable td:contains('Phone')").parent().find('td').last().text());
    
    result.email = (function() {
      var text = $.trim(el.find(".contactInfoTable td:contains('Email')").parent().find('td').last().text());
      if (text && text.match('@'))return text;
      return '';
    })();
    result.website = (function() {
      var url = $.trim(el.find(".contactInfoTable td:contains('Website')").parent().find('td').last().text());
      if (url) return url;
      return $.trim(el.find(".profileInfoTable th:contains('Website')").parent().find('td a:first').text());
    })();
	result.address = (function() {
      var url = $.trim(el.find(".contactInfoTable td:contains('Location')").parent().find('td').last().text());
      if (url) return url;
      return $.trim(el.find(".profileInfoTable th:contains('Location')").parent().find('td a:first').text());
    })();
    result.facebook = (function() {
      var link, url;
      url = $.trim(el.find('a.profileThumb').attr('href'));
      link = document.createElement('a');
      link.href = url;
      return "" + link.protocol + "//" + link.hostname + link.pathname;
    })();
    result.description = (function() {
      var text;
      text = el.find('#timelineNavContent .fbTimelineSummarySection .fbLongBlurb').text();
      return $.trim(text).replace(/\s+/g, ' ');
    })();
    
	result.addressCity = '';
    var addr = result.address.split(/\s+,\s+/g);//replace(/^[ ,]*/,'');
	
	for(var i=0;i<addr.length;++i){
		if(!addr[i])continue;
		
		if(countryName2Code[addr[i]])
			result.addressCountry = addr[i];
		else result.addressCity+=', '+addr[i];	
	}

	result.addressCity=result.addressCity.replace(/^[ ,]*/,'');
	return result;
}

function getContactDetails(){
	
	var result={};
	
	if(!$(".ProfileHeaderCard"))
    return;
    
	result.fullName = $(".ProfileHeaderCard")[0].getElementsByClassName("ProfileHeaderCard-nameLink")[0].text;
    
    result.firstName = (function(){
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
	  var i;
	  var lname = "";
      names = result.fullName.split(/\s+/);
      if (names.length > 1) {
		for (i = 1; i < names.length; i++) {
			if(names[i].indexOf('(')>=0)
				break;
			lname += names[i] + " ";
		}
        return lname;
      } else {
        return names[0] || '';
      }
    })();
    
  if(!result.firstName && result.lastName){
    result.firstName = result.lastName;
    result.lastName = "";
  }
   
    
	var twiterURL = $(".ProfileHeaderCard")[0].getElementsByClassName("ProfileHeaderCard-nameLink")[0].getAttribute("href");
	if(twiterURL.indexOf('/') != -1){
		twiterURL = twiterURL.replace("/", "");
	}
	result.twitter = "@" + twiterURL;	
	
	var image = $(".ProfileCanopy-avatar")[0].getElementsByClassName("ProfileAvatar-image")[0].getAttribute("src");

  if($(".ProfileHeaderCard-url")[0].getElementsByClassName("u-textUserColor")[0]){
    var websiteURL = $(".ProfileHeaderCard-url")[0].getElementsByClassName("u-textUserColor")[0].getAttribute("title");

    if(websiteURL)
      result.website = websiteURL;
  }

  
	
	result.image = image;	
    return result;
}

function getContactDetailsMultipleLinkedinTest(){
	var allDatas =document.getElementsByClassName("js-stream-item");
	var arr = [];
	var len = allDatas.length;
	var eachContact={};
	for (var i = 0; i < len; i++) {
	var eachContact={};
	var ele = document.getElementsByClassName("js-stream-item")[i];
	var str = ele.getElementsByClassName("fullname js-action-profile-name")[0].innerHTML;
	var fullName = str;
	
	eachContact.firstName = (function() {
      var names;
      names = fullName.split(/\s+/);
      if (names.length > 1) {
        return names[0];
      } else {
        return '';
      }
    })();
    eachContact.lastName = (function() {
      var names;
      names = fullName.split(/\s+/);
      if (names.length > 1) {
        return names.slice(1).join(' ').trim();
      } else {
        return names[0] || '';
      }
    })();
	
	
	var twitterID = ele.getElementsByTagName("a")[0].getAttribute("href");
	if(twitterID.indexOf('/') != -1){
		twitterID = twitterID.replace("/", "");
	}
	eachContact.twitter = "@" + twitterID;
	
	var image = ele.getElementsByClassName("avatar js-action-profile-avatar")[0].getAttribute("src");
	eachContact.image = image;
	eachContact.formId = i;
	arr.push(eachContact);
	}
	return arr;
    
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == 'engagebay_get_contact_details_twitter'){ 
		sendResponse({type:'PERSON', data: getContactDetails()});
	}
	if (request == 'engagebay_get_contacts_details_twitter')
    {
	sendResponse({type:'PERSON', data: getContactDetailsMultipleLinkedinTest()});
	}	
});