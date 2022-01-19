var engagebayioIframe;
var emailIds={};
var isShowAddBtns = {};

function linkProfileLinkedin() {
    var response = getContactDetailsMultipleLinkedinTestProspectProspect();
	if(response.length == 0)
		return;
	var responseElement = "";
	var isLinkedin = [];
	for(var i = 0; i < response.length; i++){
		responseElement += getEngageBayLinkedInProfileViewProspect(response[i], i, response.length);
	}
	engagebayioIframe=createPopupIframeLinkedinProspect(responseElement);
	var ele = document.getElementsByClassName('_engagebayio_extn_contact_')[response.length-1];	
	ele.style.paddingBotton = '40px';
}

function createPopupIframeLinkedinProspect(_html){
	var stylesheets = '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\
					  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css">\
					  <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.1.min.js"></script>\
					  <script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>';
	
	stylesheets = '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">\
					  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css">\
					  <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.1.min.js"></script>';

	
	if(document.getElementById('_engagebayio_extn_linkedin_iframeProspect')){
		
		return engagebayioIframe = document.getElementById('_engagebayio_extn_linkedin_iframeProspect').innerHTML= stylesheets + "<div style='position: fixed;right: 0px;top: 2px;z-index: 9999;'>\
	</div><div style='position: relative;background: #e2d7f5;text-align: center;padding: 3px 0px 3px 0px;'>\
	<img src='https://d2p078bqz5urf7.cloudfront.net/cloud/assets/img/engagebay.png' style='width:140px;padding-top:16px;padding-bottom:16px;'>\
	<div id='close-frame' style='position: absolute;right: 5px;top: 9px;cursor: pointer;'><img src='https://d2p078bqz5urf7.cloudfront.net/cloud/assets/img/cancel.svg' style='height:16px;' class='engagebayclosegprospect'></div></div>\
	<div id='_engagebayio_extn_addAllContact' style='background-color: #ece1ff;'>\
	<div id='add-all'><a href='javascript:void(0)'  class='engagebayShowAddAll'  style='float: right;margin-right: 12px;margin-top: 3px;text-decoration: none;font-size: 11px'>+ Add all</a>\
	</div>\
	<div id='engagebay_save_all_cts hide' style='display:none;'>\
	<a href='javascript:void(0)'  class='engagebaysavealltag'  style='float: right;margin-right: 12px;margin-top: 3px;text-decoration: none;font-size: 11px'>+ Add Tag</a>\
	<input id='save_all_100' type='button' value='Add all Contacts' class='save btn _engagebayio_save_ engagebay_save_all_cts engagebaysaveallnotg' data-loading-text='Searching...'style='padding:10px 0px;background-color: #f2603e;color: white;border: 1px solid #f2603e;width: 95%;margin-left: 7px;margin-top: 6px;' >\
	<div style='height: 2px;border-top: 1px solid #c5b1e6;box-shadow: 0 1px 0 #FFFFFF inset;margin-top: 7px;width: 94%;margin-left: 9px;' id='engagebay_p_f1'></div>\
	</div>\
	<div id='_engagebayio_extn_addContact' style='width:100%;padding:10px 0px;padding-left:9px;padding-right:9px;background-color: #ece1ff;'>"+_html+"</div>";
	}
		
	var divTest=document.createElement("div");
	divTest.id='_engagebayio_extn_linkedin_iframeProspect';
	divTest.setAttribute('style','right: 20px;position: absolute;top: 120px;max-width:300px;z-index: 2147483647;border-radius: 2px;border: 6px solid rgb(148, 129, 183);');

	document.body.appendChild(divTest); 
	divTest.innerHTML= stylesheets + "<div style='position: fixed;right: 0px;top: 2px;z-index: 9999;'>\
	</div><div style='position: relative;background: #e2d7f5;text-align: center;padding: 3px 0px 3px 0px;'>\
	<img src='https://d2p078bqz5urf7.cloudfront.net/cloud/assets/img/engagebay.png' style='width:140px;padding-top:16px;padding-bottom:16px;'>\
	<div id='close-frame' style='position: absolute;right:-5px;top:-25px;cursor: pointer;'><img src='https://d2p078bqz5urf7.cloudfront.net/cloud/assets/img/cancel.svg' style='height:16px;' class='engagebayclosegprospect'></div></div>\
	<div id='_engagebayio_extn_addAllContact' style='background-color: #ece1ff;'>\
	<div id='add-all'><a href='javascript:void(0)' class='engagebayShowAddAll'  style='float: right;margin-right: 12px;margin-top: 3px;text-decoration: none;font-size: 11px'>+ Add all</a>\
	</div>\
	<div id='engagebay_save_all_cts' style='display:none;'>\
	<a id='link_tag_100' href='javascript:void(0)'  class='engagebaysavealltag' style='float: right;margin-right: 12px;margin-top: 3px;text-decoration: none;font-size: 11px'>+ Add Tag</a>\
	<input id='save_all_100' type='button' value='Add all Contacts' class='save btn _engagebayio_save_ engagebay_save_all_cts engagebaysaveallnotg' data-loading-text='Searching...'style='padding:10px 0px;background-color: #f2603e;color: white;border: 1px solid #f2603e;width: 95%;margin-left: 7px;margin-top: 6px;' >\
	<div style='height: 2px;border-top: 1px solid #c5b1e6;box-shadow: 0 1px 0 #FFFFFF inset;margin-top: 13px;width: 94%;margin-left: 9px;' id='engagebay_p_f1'></div>\
	</div></div>\
	<div id='_engagebayio_extn_addContact' style='width:100%;padding:10px 0px;padding-left:9px;padding-right:9px;background-color: #ece1ff;'>"+_html+"</div>";
	

	// var css = '._engagebayio_extn_contact_:hover ._eb_show_add_tag_contact_{ display: inline !important; }',
    // head = document.head || document.getElementsByTagName('head')[0],
    // style = document.createElement('style');
	// divTest.appendChild(style);
	// style.type = 'text/css';
	// style.appendChild(document.createTextNode(css));
	
	var JS= document.createElement('script');
	JS.text= 
	"	function engagebaysaveallnotg(){\
			parent.postMessage({from:'engagebayio_extn_prospect',action:'engagebay_save_all_contacts_notags'},'*');\
		}\
		function engagebayShowAddAll(){\
			parent.postMessage({from:'engagebayio_extn_prospect',action:'engagebay_show_save_contacts'},'*');\
		}\
		function engagebayshowSavetagAndContacteach(index){\
			parent.postMessage({from:'engagebayio_extn_prospect',action:'engagebay_show_tag_add_btn',indexValue:index},'*');\
		}\
		function engagebaysavealltag(){ \
		parent.postMessage({from:'engagebayio_extn_prospect',action:'show_engagebay_tab_textfld'},'*');\
		}\
		function engagebaysaveeach(index){\
			parent.postMessage({from:'engagebayio_extn_prospect',action:'saveEachContact',indexValue:index},'*');\
		}\
		function showAddBtn(index){\
			console.log('hello');parent.postMessage({from:'engagebayio_extn_prospect',action:'showAddBtn',indexValue:index},'*');\
		}\
		function hideAddBtn(index){\
			parent.postMessage({from:'engagebayio_extn_prospect',action:'hideAddBtn',indexValue:index},'*');\
		}\
		function engagebayshowtaginputeach(index){\
			parent.postMessage({from:'engagebayio_extn_prospect',action:'engagebayshowtaginputeach1',indexValuefrm:index},'*');\
		}\
		function engagebayclosegprospect(){\
			parent.postMessage({from:'engagebayio_extn_prospect',action:'close_engagebay_google_prospect'},'*');\
		}";
	document.body.appendChild(JS);	
	
	engagebayioIframe=divTest;

	window.addEventListener("message",function(evt){
		if(evt.data.from!='engagebayio_extn_prospect')
			return;
		
		var actionReceived = evt.data.action;
		if(actionReceived=='add_contact' || actionReceived=='add_company' || actionReceived=='add_all_contact')	
		{
				
		}
		else if(actionReceived == "hideAddBtn"){
			var k = evt.data.indexValue;
			var addEle = document.getElementById("show_add_tag_contact_"+k);
			addEle.style.display = 'none';
			var showID = document.getElementById("save_button_result_"+k);
			if(showID != null)
				showID.style.display = 'none';
		}
		else if(actionReceived == "engagebay_show_tag_add_btn"){
			var k = evt.data.indexValue;
			var showID = document.getElementById("save_button_result_"+k);
			if(showID != null)
				showID.style.display = 'block';
			isShowAddBtns[k] = !isShowAddBtns[k];
			var tagele = document.getElementById("tag_each_engagebay_"+k);
			tagele.style.display = 'block';
			if((document.getElementById("show_add_tag_contact_"+k).style.display == "block") && (document.getElementById("save_button_result_"+k).style.display == "block") ){
				var showID = document.getElementById("save_button_result_"+k);
				if(showID != null)
					showID.style.display = 'block';
			}
		}
		else if(actionReceived == "showAddBtn"){
			var k = evt.data.indexValue;
			var addEle = document.getElementById("show_add_tag_contact_"+k);
			addEle.style.display = 'block';
			var showID = document.getElementById("save_button_result_"+k);
			if(isShowAddBtns[k] && showID !=null)
				showID.style.display = 'block';
			var ele = document.getElementById("tag_each_engagebay_"+k);
			if(ele == null){
				var x = document.getElementById('save_button_result_'+k+'');
				if(document.getElementById('link_each_text_'+k+'') != null)
					document.getElementById('link_each_text_'+k+'').style.display = "none";
				var y = '<input autocomplete="off" id="tag_each_engagebay_'+k+'" type="text" name="tags"  placeholder="Separate tags using comma" style="margin-bottom:5px;margin-top: 5px;width: 100%;color: #263238;font-weight: 400;outline: none !important;box-shadow: none;overflow: hidden;line-height: normal !important;border: 0px solid;background-color: #ffffff;border-radius: 4px;padding: 0 6px;height: 29px;font-size: 11px;">\
				';
				if(x != null)
					x.insertAdjacentHTML('afterbegin',y);
			}
			/*var tagele = document.getElementById("tag_each_engagebay_"+k);
			tagele.style.display = 'block';
			if((document.getElementById("show_add_tag_contact_"+k).style.display == "block") && (document.getElementById("save_button_result_"+k).style.display == "block") ){
				var showID = document.getElementById("save_button_result_"+k);
				showID.style.display = 'block';
			}*/
		}
		else if(actionReceived == 'engagebay_show_save_contacts'){
			var showId = document.getElementById('engagebay_save_all_cts');
			if(showId != null)
				showId.style.display = 'block';
			var individualContactID = document.getElementById('_engagebayio_extn_addContact');
			individualContactID.style.paddingTop = '30px';
			var x = document.getElementById('save_all_100');
			$('#link_tag_100').remove();
			if($("#tag_all_engagebay").length == 0){
				var y = '<div id="tag_edit_frm_all">\
				<input autocomplete="off" id="tag_all_engagebay" type="text" name="tags" placeholder="Separate tags using comma" style="margin-top: 5px;margin-left: 8px;width: 94%;color: #263238;font-weight: 400;outline: none !important;box-shadow: none;overflow: hidden;line-height: normal !important;border: 0px solid;background-color: #ffffff;border-radius: 4px;padding: 0 6px;height: 29px;font-size: 11px;">\
				</div>';
				x.insertAdjacentHTML('beforebegin',y);
			}
			// else{
			//	if(document.getElementById("tag_drpdwn_engagebay") != null)
			//		document.getElementById("tag_drpdwn_engagebay").remove();
			// }

		}
		else if(actionReceived=='close_engagebay_google_prospect')
		{
			document.getElementById('_engagebayio_extn_linkedin_iframeProspect').remove();
			return;
		}
		else if(actionReceived=='show_engagebay_tab_textfld'){
			var x = document.getElementById('save_all_100');
			$('#link_tag_100').remove();
			if(document.getElementById("tag_drpdwn_engagebay") == undefined || document.getElementById("tag_drpdwn_engagebay") == null){
				var y = '<div id="tag_edit_frm_all">\
				<input autocomplete="off" id="tag_all_engagebay" type="text" name="tags" placeholder="Separate tags using comma" style="margin-top: 5px;margin-left: 8px;width: 94%;color: #263238;font-weight: 400;outline: none !important;box-shadow: none;overflow: hidden;line-height: normal !important;border: 0px solid;background-color: #ffffff;border-radius: 4px;padding: 0 6px;height: 29px;font-size: 11px;">\
				</div>';
				x.insertAdjacentHTML('beforebegin',y);
			}else{
				if(document.getElementById("tag_drpdwn_engagebay") != null)
					document.getElementById("tag_drpdwn_engagebay").remove();
			}
			
		}
		else if(actionReceived=='engagebayshowtaginputeach1'){
			
			var k = evt.data.indexValuefrm;
			var x = document.getElementById('save_button_result_'+k+'');
			if(document.getElementById('link_each_text_'+k+'') != null)
				document.getElementById('link_each_text_'+k+'').style.display = "none";
			var y = '<input autocomplete="off" id="tag_each_engagebay_'+k+'" type="text" name="tags"  placeholder="Separate tags using comma" style="margin-bottom:5px;margin-top: 5px;width: 100%;color: #263238;font-weight: 400;outline: none !important;box-shadow: none;overflow: hidden;line-height: normal !important;border: 0px solid;background-color: #ffffff;border-radius: 4px;padding: 0 6px;height: 29px;font-size: 11px;">\
			';
			if(x != null)
				x.insertAdjacentHTML('beforebegin',y);
			
		}
		else if(actionReceived=='engagebay_save_all_contacts_notags'){
			// Disable button
			// $("#_engagebayio_extn_addAllContact ._engagebayio_save_").css('pointer-events','none');

			var addId = document.getElementById('add-all');
			addId.style.display = 'none';

			 var tagreceive = document.getElementById("tag_all_engagebay");
			 var tags_input=["LinkedIn"];
			if(tagreceive == null){
				for(var k=0; k< document.getElementsByClassName('_engagebayio_extn_contact_').length; k++){
				 createContactFormate('add_all_contact_tesr',k,tags_input,"engagebay_save_all_contacts");
				 }
				 hideShowAddallButton();
			}else if(tagreceive.value == null || tagreceive.value == ''){
				for(var k=0; k< document.getElementsByClassName('_engagebayio_extn_contact_').length; k++){
				 createContactFormate('add_all_contact_tesr',k,tags_input,"engagebay_save_all_contacts");
				 }
				 hideShowAddallButton();
			}else{
				tagreceive = document.getElementById("tag_all_engagebay").value;
				var isVaildTagInput=false;
				var tags_received = tagreceive;
				if(tags_received.indexOf(",")>0){
							var tagsarr = tags_received.split(",");
							for(var j=0;j<tagsarr.length;j++){
								var eachTag = tagsarr[j];
								eachTag = eachTag.trim();
								if(isValidTagTestergprospct(eachTag)){
									tags_input.push(eachTag);
								}else{
									isVaildTagInput = true;
								}
								
							}
						}else{
							tags_received = tags_received.trim();
							if(tags_received.length > 0 && isValidTagTestergprospct(tags_received)){
								tags_received = tags_received.trim();
								tags_input.push(tags_received);
							}else{
								isVaildTagInput = true;
							}
						}
				if(isVaildTagInput){
							var x = document.getElementById('engagebay_p_f1');
							if(document.getElementById("tag_all_engagebay_errmsg_"+k+"") == undefined || document.getElementById("tag_all_engagebay_errmsg_"+k+"") == null){
								var y = '<div id="tag_all_engagebay_errmsg_'+k+'" style="padding-left: 9px;padding-top: 5px;color: red;font-size: 11px;">Should start with an alphabet & cannot contain special characters other than underscore and space.</div>';
								x.insertAdjacentHTML('beforebegin',y);
								// Enable button
								$("#_engagebayio_extn_addAllContact ._engagebayio_save_").css('pointer-events','inherit');

								return;
							}
				}else{
					for(var k=0; k< document.getElementsByClassName('_engagebayio_extn_contact_').length; k++){
						 createContactFormate('add_all_contact_tesr',k,tags_input,"engagebay_save_all_contacts");
						 } 
					hideShowAddallButton();
				}		
				
			} 
			
			
			
		}
		else if(actionReceived=='saveEachContact'){
			var k = evt.data.indexValue;
			var tagreceive = document.getElementById("tag_each_engagebay_"+k+"");
			var tags_input=["LinkedIn"];
			if(tagreceive == null){
				 createContactFormate('add_all_contact_tesr',k,tags_input,"engagebay_save_all_contacts");
			}else if(tagreceive.value == null || tagreceive.value == ''){
				createContactFormate('add_all_contact_tesr',k,tags_input,"engagebay_save_all_contacts");
			}else{
				tagreceive = document.getElementById("tag_each_engagebay_"+k+"").value;
				var tags_received = tagreceive;
				if(tags_received.indexOf(",")>0){
					var tagsarr = tags_received.split(",");
					for(var j=0;j<tagsarr.length;j++){
						var eachTag = tagsarr[j];
						eachTag = eachTag.trim();
						if(isValidTagTestergprospct(eachTag)){
							tags_input.push(eachTag);
						}else{
							isVaildTagInput = true;
						}
					}
				}else{
					tags_received = tags_received.trim();
					if(tags_received.length > 0 && isValidTagTestergprospct(tags_received)){
						tags_received = tags_received.trim();
						tags_input.push(tags_received);
					}else{
						isVaildTagInput = true;
					}
				}
				if(isVaildTagInput){
							var x = document.getElementById('echcont_nwl_'+k+'');
							if(document.getElementById("tag_all_engagebay_errmsg_"+k+"") == undefined || document.getElementById("tag_all_engagebay_errmsg_"+k+"") == null){
								var y = '<div id="tag_all_engagebay_errmsg_'+k+'" style="padding-left: 9px;padding-top: 5px;color: red;font-size: 11px;">Should start with an alphabet & cannot contain special characters other than underscore and space.</div>';
								x.insertAdjacentHTML('beforebegin',y);
								return;
							}
				}else{
					createContactFormate('add_all_contact_tesr',k,tags_input,"engagebay_single_contact"); 
				}
				
			} 
		}
		},false);
	
	return engagebayioIframe;
}

function getEngageBayLinkedInProfileViewProspect(linkedInProfile, index, endIndex){
	var html = "\<div id='_engagebayio_extn_addContact_"+index+"' data-index='"+index+"' class='_engagebayio_extn_contact_' style='padding-top:15px;' >\
				<input name='first_name' type='hidden' class='_engagebayio_inp' value="+ linkedInProfile.firstName +">\
				<input name='last_name' type='hidden' class='_engagebayio_inp' value="+ linkedInProfile.lastName +">\
				<input name='website' data-subtype='LINKEDIN' type='hidden' class='_engagebayio_inp' value="+linkedInProfile.linkedin+">";
	if(linkedInProfile.role){
		html += "\<input name='role' type='hidden' class='_engagebayio_inp' value='"+linkedInProfile.role+"'>";
	}
	if(linkedInProfile.company){
		html += "\<input name='company' type='hidden' class='_engagebayio_inp' value='"+linkedInProfile.company+"'>";
	}
	html += "\<div style='word-break: break-word;font-size: 13px;margin-top: 5px;display: inline-block;margin-right: 10px;'>"+linkedInProfile.firstName+" "+linkedInProfile.lastName+"</div>\
				<div id='save_msg_result_"+index+"' style='color: #2CA54C;font-size: 13px;display: inline-block;'></div>";
	if(linkedInProfile.role)
		html +="\<div class='text-muted' style='font-size: 13px;'>"+linkedInProfile.role+"</div>";
	if(linkedInProfile.company)
		html += "\<div class='text-muted' style='font-size: 13px;'>"+linkedInProfile.company+"</div>";
	html += '<a id="show_add_tag_contact_'+index+'" class="_eb_show_add_tag_contact_" href="javascript:void(0)" style="display:none;float: right;text-decoration: none;margin-bottom: 5px;font-size: 11px;">+ Add</a><div id="save_button_result_'+index+'" style="margin-top: 5px;display:none;margin-bottom:10px;"><a id="link_each_text_'+index+'" href="javascript:void(0)" class="engagebayshowtaginputeach" style="float: right;text-decoration: none;margin-bottom: 5px;font-size: 11px;">+ Add Tag</a>'
	html += "\
					<input type='button' value='Add Contact' style='background-color:#f2603e;width:100%;padding:10px 0px;border-color:#f2603e;color:#fff' class='save btn btn-sm  _engagebayio_save_ _engagebayio_save_each_' data-loading-text='Searching...' style='width: 100%;'>\
				\
				</div>"
	if(index != endIndex-1){
		html += "<div id='echcont_nwl_"+index+"' style='height: 2px;width: 275px;border: 0;border-top: 1px solid #c5b1e6;box-shadow: 0 1px 0 #FFFFFF inset;margin-top:12px;'></div>";
	}
	html += "</div>";
	
	return html;
}

function getContactDetailsMultipleLinkedinTestProspectProspect(){
	var allDatas =document.getElementsByClassName("g");
	var arr = [];
	var len = allDatas.length;
	var eachContact={};
	var checkLinkdinCount = 0;
	for (var i = 0; i < len; i++) {
	var eachContact={};
	var ele = document.getElementsByClassName("g")[i];
	var str = ele.getElementsByTagName("a")[0].text;
	var fullName = str.split("| LinkedIn")[0];
	
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
	
	
	var linkedinID = ele.getElementsByTagName("a")[0].getAttribute("data-href") || ele.getElementsByTagName("a")[0].getAttribute("href")
	// Modified to show contacts for LinkedIns on selecting Role, Country and Location 
	if(linkedinID != null || linkedinID != undefined){
		if(linkedinID.indexOf('www.') > 0){
			linkedinID = linkedinID.split("www.")[1].slice(0,-1);
		}else {
			linkedinID = linkedinID.replace("https://se.", "");
			linkedinID = linkedinID.replace("http://se.", "");
			linkedinID = linkedinID.replace("https://in.", "");
			linkedinID = linkedinID.replace("http://in.", "");
			linkedinID = linkedinID.replace("https://", "");
			linkedinID = linkedinID.replace("http://", "");
			
		}
		eachContact.linkedin = linkedinID;	
	}
	
	
	var company = "";
	var role = "";
	if(ele.getElementsByClassName("f slp")[0] != null){
    var allInfo = ele.getElementsByClassName("f slp")[0].innerHTML;
	
	var allInfoArr = allInfo.split(' - ');
	if(allInfoArr.length == 3){
		if(allInfoArr[1] && allInfoArr[1].indexOf('at') >= 0){
			company = allInfoArr[1].split(' at ')[1];
			role = allInfoArr[1].split(' at ')[0];
		}else{
			company = allInfoArr[2];
			role = allInfoArr[1]
		}
	}else{
		if(allInfoArr[1] && allInfoArr[1].indexOf('at') >= 0){
			company = allInfoArr[1].split(' at ')[1];
			role = allInfoArr[1].split(' at ')[0];
		}else{
			role = allInfoArr[1]
		}
	}
	eachContact.company = company;
	eachContact.role = role;
	}
	if(eachContact.linkedin != null || eachContact.linkedin != undefined){
		if(eachContact.linkedin.indexOf('linkedin.com') >= 0){
			if(eachContact.linkedin.indexOf('linkedin.com/company') >= 0){
				arr.push(eachContact);
				checkLinkdinCount=checkLinkdinCount+1;
			}else{
				arr.push(eachContact);
				checkLinkdinCount=checkLinkdinCount+1;
			}
			
		}
		
	}
	}
	if(checkLinkdinCount < 2)
		arr = [];
	return arr;
}

function hideShowAddallButton(){
	var showId = document.getElementById('engagebay_save_all_cts');
	showId.style.display = 'none';
	var individualContactID = document.getElementById('_engagebayio_extn_addContact');
	individualContactID.style.paddingTop = '0px';
	var addId = document.getElementById('add-all');
	addId.style.display = 'block';
}

function isValidTagTestergprospct(tag) {
	 var r = '\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC';
	 var regexString = '^['+r+']['+r+' 0-9_-]*$';
	 var is_valid = new RegExp(regexString).test(tag);
	 return is_valid;
}

function createContactFormate(actionMsg,index,tags_input,message){
	var ind = 'div#_engagebayio_extn_addContact_'+index;
	var indd = ind+' input._engagebayio_inp';
	var inputs=document.querySelectorAll(indd);
	var contact={};
	contact.contact_company_id=null;
	var props=[];
	
		for(var i=0;i<inputs.length;++i){
		if(!inputs[i].value)continue;
			if(inputs[i].dataset['subtype']){
					props.push({name:inputs[i].name,value:inputs[i].value,subtype:inputs[i].dataset['subtype']});
				}
				else props.push({name:inputs[i].name,value:inputs[i].value,type:'SYSTEM'});
			}
		var addrCustom={};
		var addrElems=document.querySelectorAll('div#_engagebayio_extn_addContact ._engagebayio_inp_custom.address[name]');
			
		for(var i=0;i<addrElems.length;++i){
			if(addrElems[i].value && addrElems[i].value.length>0)
				addrCustom[addrElems[i].name]=addrElems[i].value;
		}
		if(addrCustom.addressCity || addrCustom.addressCountry)
		{
			var obj={};
			if(addrCustom.addressCity)obj.city=addrCustom.addressCity;
			if(addrCustom.addressCountry)obj.country=addrCustom.addressCountry;
			props.push({name:'address',value:JSON.stringify(obj),subtype:''});
		}
		//console.log(props);
		saveEachContactEngagebay(props,index,tags_input,message)
}
function saveEachContactEngagebay(properties,indexRecevied,tags_input,message){
			var totalCountOfContact = document.getElementsByClassName('_engagebayio_extn_contact_').length;
			var actionReceived = message;
			var contact={};
			contact.contact_company_id=null;
			var props=[];
			props = properties;
			var linkedInURL = "";
			for(var i=0;i<props.length;++i)
				{	
					var s = props[i].name;
					var t = props[i].value;
					if(props[i].name =='website')
					{	
						var e = props[i].name.value;
						linkedInURL = props[i].value;
						props[i].subtype = "LINKEDIN";
						
					}
				}
			engagebay_get_linked_profilegoogle(linkedInURL,indexRecevied,actionReceived, function(response){
					contact.properties=JSON.stringify(props);
					contact.tags=JSON.stringify(tags_input);
					contact.tagsWithTime=[];
					
					contact.type='PERSON';
					
					// Disable button
					// $("#save_button_result_"+indexRecevied+" ._engagebayio_save_").css('pointer-events','none');


					_EB_Request_Processor("/api/browser-extension/addcontact",contact, "POST",function(resp) {
									var elemSelector='';
									for(var i=0;i<resp.properties.length;++i)
									{	
										if(resp.properties[i].name='email')
										{	
											elemSelector+="i._engagebayio_extn_[data-email='"+resp.properties[i].value+"'],";
											emailIds[resp.properties[i].value]=resp;
										}
									}
									$("#save_button_result_"+indexRecevied+"").css('display','none');
									$("#save_msg_result_"+indexRecevied+"").html("<span class='glyphicon glyphicon-ok-sign'></span>");
									if(actionReceived == 'engagebay_save_all_contacts' && indexRecevied == totalCountOfContact - 1){
										$("#_engagebayio_extn_addAllContact").html('<div class="text-success text-center" style="padding: 10px;">Contacts has been saved successfully</div><div style="border-top: 1px solid #c5b1e6;box-shadow: 0 1px 0 #FFFFFF inset;margin-top: 7px;margin-bottom:-5px;"></div>')
									}
								},function(err) {
									$("#save_button_result_"+indexRecevied+"").css('display','none');
									var errMessge = err.responseText;
									if(!errMessge)
										errMessge = "Error while saving the contact.";

		     						$("#save_msg_result_"+indexRecevied+"").html("<div id='message' style='color: #dd4b39;font-size: 12px;padding-top:10px;display: inline-block;'>"+errMessge+"</div>");
		     					
								},"application/x-www-form-urlencoded");
			},
			function(err){
				alert(err.responseText);
			});		
}

function engagebay_get_linked_profilegoogle(URL,indexRecevied,actionReceived, callback){
				if(document.getElementById('tag_all_engagebay_errmsg_'+indexRecevied+'') != null){
						document.getElementById('tag_all_engagebay_errmsg_'+indexRecevied+'').remove();
					}
				if(document.getElementById('link_each_text_'+indexRecevied+'') != null){
						document.getElementById('link_each_text_'+indexRecevied+'').remove();
					}	
				if(document.getElementById('tag_each_engagebay_'+indexRecevied+'') != null){
						document.getElementById('tag_each_engagebay_'+indexRecevied+'').remove();
					}	
				if(actionReceived == 'add_all_contact'){
					$("#_engagebayio_extn_addAllContact").html('<div id="_engagebayio_extn_addAllContact" style="background-color: #ece1ff;"><input type="button" value="Saving ..." class="save btn _engagebayio_save_" style="background-color: #f2603e;color: white;border: 1px solid #f2603e;width: 95%;margin-left: 7px;margin-top: 6px;cursor: default;">	<div style="border-top: 1px solid #c5b1e6;box-shadow: 0 1px 0 #FFFFFF inset;margin-top: 7px;"></div></div>')
					callback("success");
				}
				if(actionReceived == 'add_all_companies'){
					$("#_engagebayio_extn_addAllCompany").html('<div id="_engagebayio_extn_addAllCompany" style="background-color: #ece1ff;"><input type="button" value="Saving ..." class="save btn _engagebayio_save_" style="background-color: #f2603e;color: white;border: 1px solid #f2603e;width: 95%;margin-left: 7px;margin-top: 6px;cursor: default;">	<div style="border-top: 1px solid #c5b1e6;box-shadow: 0 1px 0 #FFFFFF inset;margin-top: 7px;"></div></div>')
					callback("success");
				}else{
					/*if(document.getElementById('save_button_result_'+indexRecevied+'') != null){
						document.getElementById('save_button_result_'+indexRecevied+'').remove();
					}
					//tagfrm_each_Engagebay_'+k+'"
					if(document.getElementById('tagfrm_each_engagebay_'+indexRecevied+'') != null){
						document.getElementById('tagfrm_each_engagebay_'+indexRecevied+'').remove();
					}*/
					$("#save_msg_result_"+indexRecevied+"").html("<img src='https://doxhze3l6s7v9.cloudfront.net/beta/static/img/chrome_extension_saving.gif' height='14px' width='32px'> Saving ...</div>");
					callback("success");
				}
}

function engagebaysaveallnotg(){
	parent.postMessage({from:'engagebayio_extn_prospect',action:'engagebay_save_all_contacts_notags'},'*');
}
function engagebayShowAddAll(){
	parent.postMessage({from:'engagebayio_extn_prospect',action:'engagebay_show_save_contacts'},'*');
}
function engagebayshowSavetagAndContacteach(index){
	parent.postMessage({from:'engagebayio_extn_prospect',action:'engagebay_show_tag_add_btn',indexValue:index},'*');
}
function engagebaysavealltag(){ 
parent.postMessage({from:'engagebayio_extn_prospect',action:'show_engagebay_tab_textfld'},'*');
}
function engagebaysaveeach(index){
	parent.postMessage({from:'engagebayio_extn_prospect',action:'saveEachContact',indexValue:index},'*');
}
function showAddBtn(index){
	parent.postMessage({from:'engagebayio_extn_prospect',action:'showAddBtn',indexValue:index},'*');
}
function hideAddBtn(index){
	parent.postMessage({from:'engagebayio_extn_prospect',action:'hideAddBtn',indexValue:index},'*');
}
function engagebayshowtaginputeach(index){
	parent.postMessage({from:'engagebayio_extn_prospect',action:'engagebayshowtaginputeach1',indexValuefrm:index},'*');
}
function engagebayclosegprospect(){
	parent.postMessage({from:'engagebayio_extn_prospect',action:'close_engagebay_google_prospect'},'*');
}

setTimeout(function(){
var currentURL = '';
currentURL = window.location.href;

		linkProfileLinkedin();

		$(document).on('click', ".engagebaysaveallnotg", function(evt){
			evt.preventDefault();
			engagebaysaveallnotg();
		});

		$(document).on('click', ".engagebayshowtaginputeach", function(evt){
			evt.preventDefault();
			engagebayshowtaginputeach($(this).closest('._engagebayio_extn_contact_').attr('data-index'));
		});

		$(document).on('click', ".engagebaysavealltag", function(evt){
			evt.preventDefault();
			engagebaysavealltag();
		});

		$(document).on('click', ".engagebayShowAddAll", function(evt){
			evt.preventDefault();
			engagebayShowAddAll();
		});

		$(document).on('click', ".engagebayclosegprospect", function(evt){
			engagebayclosegprospect();
		});

		$(document).on('click', "._engagebayio_save_each_", function(evt){
			var index = $(this).closest('._engagebayio_extn_contact_').attr('data-index');
			engagebaysaveeach(index);
			engagebayshowSavetagAndContacteach(index);
		});

		$("._engagebayio_extn_contact_", document).on('mouseleave', function(evt){
			hideAddBtn($(this).attr('data-index'));
		});

		$("._engagebayio_extn_contact_", document).on('mouseenter', function(evt){
			showAddBtn($(this).attr('data-index'));
		});

		$(document).on('click', '._eb_show_add_tag_contact_', function(evt){
			evt.preventDefault();
			var index = $(this).closest('._engagebayio_extn_contact_').attr('data-index');
			$("#save_msg_result_"+index+"").html("");
			engagebayshowSavetagAndContacteach(index);
		});
		
		$(document).on("click","div#_engagebayio_extn_addContact",function(evt){

			if(evt.target.className=='_engagebayio_cancel_'){
				$(this).hide();
			}
			else if(evt.target.className=='_engagebayio_save_'){
				var contact={};
				contact.contact_company_id=null;
				contact.tags=[];
				contact.tagsWithTime=[];
				contact.type='PERSON';
				contact.properties=[];;
			}
		}); 
}, 2000);


var currentUrl = document.location.href;

var POLL_INTERVAL = 1000; 

setInterval(function(){
	
  if (document.location.href != currentUrl) {	  
	var currentURL = document.location.href;
		setTimeout(function(){
			linkProfileLinkedin();
		}, 2000);
	currentUrl = document.location.href;	
  } 
}, POLL_INTERVAL)

