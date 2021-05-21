var body = document.querySelector('body');

function createSingleFetchElement(){
    var htmlelmnt = $('div.ProfileMessagingActions-actionsContainer')[0];
    var buttond = '<button id="createcontactsingle200" type="button" class="btn primary-btn" style="background-color:#f2603e;width: 100%;margin-top: 15px;color:#fff;padding-top: 12px;padding-bottom: 12px;border: 1px solid #f2603e;"> <span class="text">Add to EngageBay</span></button>';
    // Don't add button if exists
    if(htmlelmnt == undefined || $("#createcontactsingle200", htmlelmnt)[0])
           return;
    // 'Add to EngageBay' button added at the end
    htmlelmnt.insertAdjacentHTML('beforeend',buttond);
    htmlelmnt.querySelector('#createcontactsingle200').addEventListener('click',addContactCall200,true);
}
function contactInfo() {
    var twitter = (function() {
        var id;
        var id1 = window.location.href;
        var id2 = $(".ProfileHeaderCard")[0].getElementsByClassName("ProfileHeaderCard-nameLink");
        if (id2.length > 0) {
            var idcontent = id2[0].getAttribute("href")
            if (idcontent.length > 0) {
                return idcontent;
            }
        } else {
            return id1;
        }
    })();
    if (twitter != undefined || twitter != null) {
        createSingleFetchElement();
    }
}

addContactCall200 = function(){
    // Disable button
    $("#createcontactsingle200").css('pointer-events','none');
    
    var x = getContactDetails();
    var y = createContactFormate100(x);
    }

function saveEachContactToEngagebay(properties){
            var contact={};
            contact.contact_company_id=null;
            var props=[];
            props = properties;
                    contact.properties=JSON.stringify(props);
                    var tags_input=JSON.stringify(["twitter prospect"]);
                    contact.tags=tags_input;
                    contact.tagsWithTime=[];
                    
                    contact.type='PERSON';
                    //Add Source
                    contact.source='TWITTER';
                    contact.isFromTwitter = true;
                    
                    _EB_Request_Processor("/api/browser-extension/addcontact",contact, "POST",function(resp) {
                        document.getElementById('createcontactsingle200').remove();
                        var htmlelmnt =  $('div.ProfileMessagingActions-buttonWrapper.u-sizeFull')[0];
                        //var buttond = '<input type="button" id="createcontactsingle200" value="Contact Added to EngageBay" class="save btn btn-sm btn-primary _engagebay_save_" style="padding: 5px 10px;font-size: 12px;line-height: 2.5;border-radius: 3px;background: #5cb85c;border: 0px;color: #fff;width: 100%;margin-top: 3px;" disabled="disabled">';
                        var buttond = '<div id="createcontactsingle100100" style="color: #0084bf;text-align: center;padding-top: 7px;">Contact added to EngageBay</div>';
                        if(htmlelmnt == undefined){
                            var htmlelmnt1 = $('div.ProfileMessagingActions-actionsContainer')[0];
                            if(htmlelmnt1 !=undefined){
                                htmlelmnt1.insertAdjacentHTML('beforeend',buttond);
                                return;
                            }else{
                                return;
                            }
                        }
                        htmlelmnt.insertAdjacentHTML('beforeend',buttond);
                    }, 
                    function(err)
                        {
                        document.getElementById('createcontactsingle200').remove();
                        var htmlelmnt =  $('div.ProfileMessagingActions-buttonWrapper.u-sizeFull')[0];
                        //var buttond = '<input type="button" id="createcontactsingle200" value="Duplicate found" class="save btn btn-sm btn-primary _engagebay_save_" style="padding: 5px 10px;font-size: 12px;line-height: 2.5;border-radius: 3px;background: #c9302c;border: 0px;color: #fff;width: 100%;margin-top: 3px;" disabled="disabled">';
                        var buttond = '<div id="createcontactsingle100100" style="color: #0084bf;text-align: center;padding-top: 7px;">Duplicate Contact found</div>';
                        htmlelmnt.insertAdjacentHTML('beforeend',buttond);
                    });
                    
}
    
function  createContactFormate100(inputs){

    var contact={};
    contact.contact_company_id=null;
    var props=[];
    
    if(inputs.email != undefined && inputs.email.length > 0){
         props.push({name:'email',value:inputs.email,type:'SYSTEM'});
    }
    
    if(inputs.firstName != undefined && inputs.firstName.length > 0){
         props.push({name:'first_name',value:inputs.firstName,type:'SYSTEM'});
    }
    
    if(inputs.lastName != undefined && inputs.lastName.length > 0){
         props.push({name:'last_name',value:inputs.lastName,type:'SYSTEM'});
    }
    
    if(inputs.mobile != undefined && inputs.mobile.length > 0){
         props.push({name:'phone',value:inputs.mobile,type:'SYSTEM',subtype:''});
    }
    
    if(inputs.linkedin != undefined && inputs.linkedin.length > 0){
         props.push({name:'website',value:inputs.linkedin,type:'SYSTEM',subtype:'LINKEDIN'});
    }
    
    if(inputs.twitter != undefined && inputs.twitter.length > 0){
         props.push({name:'website',value:inputs.twitter,type:'SYSTEM',subtype:'TWITTER'});
    }
    
    if(inputs.website != undefined && inputs.website.length > 0){
         props.push({name:'website',value:inputs.website,type:'SYSTEM',subtype:'URL'});
    }
    
    if(inputs.image != undefined && inputs.image.length > 0){
         props.push({name:'image',value:inputs.image,type:'SYSTEM'});
    }
    
    if(inputs.company != undefined && inputs.company.length > 0){
         props.push({name:'company',value:inputs.company,type:'SYSTEM'});
    }
    
    if(inputs.role != undefined && inputs.role.length > 0){
         props.push({name:'role',value:inputs.role,type:'SYSTEM'});
    }
    saveEachContactToEngagebay(props);
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

    //ghanshyam
    var country = $(".ProfileHeaderCard-location")[0].getElementsByClassName("ProfileHeaderCard-locationText")[0].innerText;
    

    return result;
}   
setTimeout(function() {
    var currentURL = '';
    currentURL = window.location.href;
    var x = $(".ProfileHeaderCard")[0];

    if (x != undefined) {
        contactInfo();
    }
}, 3000);

var oldLocation = location.href;
setInterval(function() {
    var svmsg = document.getElementById('createcontactsingle100100');
    if (svmsg != null) {
        setTimeout(function() {
            document.getElementById('createcontactsingle100100').remove();
        }, 3000);
    }
}, 5000); // check every 5 second
		
setInterval(function() {
    if (location.href != oldLocation) {
        // do your action
        oldLocation = location.href
        var svbt = document.getElementById('createcontactsingle100');
        var svmsg = document.getElementById('createcontactsingle100100');
        if (svbt != null) {
            document.getElementById('createcontactsingle100').remove();
        }
        if (svmsg != null) {
            document.getElementById('createcontactsingle100100').remove();
        }
        var x = $(".ProfileHeaderCard")[0];
        if (x != undefined) {
            contactInfo();
        }
    }
}, 1000); // check every second	