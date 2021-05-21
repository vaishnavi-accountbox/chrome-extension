function EngageBayGetAndCompileTemplate(templateName, context) {
	return EngageBayCompileTemplate(engageBayTemplate[templateName], context);
}

//To compare values
Handlebars.registerHelper('EngageBayGetAndCompileTemplate', function(templateName, obj, options) {

	try {
		return new Handlebars.SafeString(EngageBayGetAndCompileTemplate(templateName, obj));
	} catch (e) {
	}

	return "";

});

const engageBayTemplate = {

	'inline-attachment' : 'https://eblink1.com/repofilepreview?repo_id={{repo_id}}&nid={{getAuthDetails "domain_id"}}&user_id={{getAuthDetails "id"}}&random_id={{random_id}}&thread_id={{thread_id}}&from_email={{from_email}}&source=web_ext',

	'toolkit' : '<div class="aoD az6 SubjectToolbar engagebay-subject-toolbar" style="width: initial; padding: 0px;"> <div> <div style="display: inline-block; font-family: Segoe UI, Segoe WP, Tahoma, Arial, sans-serif; font-size: 12px; margin-right: 5px; padding-right: 10px; border-right: 1px solid #f6f6f6; background: #f6f6f6; padding: 6px 10px 10px 10px;"> <img src="{{getImageURL "images/icon_32.png"}}" style="vertical-align: middle; height: 17px; width: 16px;"> <span style="vertical-align: middle; font-weight: 500;">EngageBay</span> </div> <div style="display: inline-block; margin-right: 10px; font-family: Segoe UI, Segoe WP, Tahoma, Arial, sans-serif; font-size: 12px;"> <span class="be-checkbox" style="cursor: pointer;" data-tooltip="This email will be tracked so you will get open and click notifications."> <input style="vertical-align: top;" class="eb-checkbox engageBayTrackEmail" type="checkbox" id="engageBayTrackEmail_{{random_id}}" checked="checked"> <label for="engageBayTrackEmail_{{random_id}}" style="vertical-align: middle;">Track Mail</label> </span> </div> <div style="display: inline-block; margin-right: 10px; font-family: Segoe UI, Segoe WP, Tahoma, Arial, sans-serif; font-size: 12px;" data-tooltip="Recipient will be added as a contact in your EngageBay account."> <span class="be-checkbox" style="cursor: pointer;"> <input style="vertical-align: top;" class="eb-checkbox engageBaySyncContacts" type="checkbox" id="engageBaySyncContacts_{{random_id}}"> <label for="engageBaySyncContacts_{{random_id}}" style="vertical-align: middle;">Sync Recipients</label> </span> </div> <div id="engagebayEmailTemplates" style="float: right; cursor: pointer; font-family: Segoe UI, Segoe WP, Tahoma, Arial, sans-serif; font-size: 12px; margin-right: 3px; display: inline-block; padding-top: 7px;" data-tooltip="Insert a Template"> <img src="{{getImageURL "images/email-template.png"}}" style="vertical-align: middle; height: 18px;"> <a style="vertical-align: middle;">Templates</a> </div> <div id="engagebayDocuments" style="cursor: pointer; font-family: Segoe UI, Segoe WP, Tahoma, Arial, sans-serif; font-size: 12px; margin-right: 10px; float: right; display: inline-block; padding-top: 7px;" data-tooltip="Insert a Document"> <img src="{{getImageURL "images/documents.png"}}" style="vertical-align: middle; height: 18px;"> <a style="vertical-align: middle;">Documents</a> </div> </div> </div>',

	'outlook-toolkit' : '<div class="engagebay-subject-toolbar {{outlook_service_type}}" style="width: initial;padding:0px;color:#333;"> <div> <div style="display: inline-block;font-family: Segoe UI, Segoe WP, Tahoma, Arial, sans-serif;font-size: 12px;margin-right: 10px;padding-right: 10px;border-right: 1px solid #f6f6f6;background: #f6f6f6;padding: 6px 10px 10px 10px;"> <img src="{{getImageURL "images/icon_32.png"}}" style="vertical-align: middle;height: 17px;width:16px;"> <span style="vertical-align: middle;font-weight: 500;">EngageBay</span> </div> <div style="display: inline-block; margin-right: 10px; font-family: Segoe UI, Segoe WP, Tahoma, Arial, sans-serif; font-size: 12px;"> <span class="be-checkbox" style="cursor: pointer;" data-tooltip="This email will be tracked so you will get open and click notifications."> <input style="vertical-align: middle;" class="eb-checkbox engageBayTrackEmail" type="checkbox" id="engageBayTrackEmail_{{random_id}}" checked="checked"> <label for="engageBayTrackEmail_{{random_id}}" style="vertical-align: middle;">Track Mail</label> </span> </div><div style="display: inline-block; margin-right: 10px; font-family: Segoe UI, Segoe WP, Tahoma, Arial, sans-serif; font-size: 12px;"> <span class="be-checkbox" style="cursor: pointer;" > <input style="vertical-align: top;" class="eb-checkbox engageBaySyncContacts" type="checkbox" id="engageBaySyncContacts_{{random_id}}"> <label for="engageBaySyncContacts_{{random_id}}" style="vertical-align: middle;">Sync Recipients</label> </span> </div>   <div id="engagebayEmailTemplates" style="float: right;cursor: pointer;font-family: Segoe UI, Segoe WP, Tahoma, Arial, sans-serif;font-size: 12px;margin-right: 10px;display: inline-block;padding-top: 7px;" data-tooltip="Insert a Template"> <img src="{{getImageURL "images/email-template.png"}}" style="vertical-align: middle;height: 18px;"> <a style="vertical-align: middle;">Templates</a> </div> <div id="engagebayDocuments" style="cursor: pointer;font-family: Segoe UI, Segoe WP, Tahoma, Arial, sans-serif;font-size: 12px;margin-right: 30px;float: right;display: none;padding-top: 7px;" data-tooltip="Insert a Document"> <img src="{{getImageURL "images/documents.png"}}" style="vertical-align: middle;height: 18px;"> <a style="vertical-align: middle;">Documents</a> </div> </div></div>',

	"track-content" : '<div id="engagebay-track" class="engagebay-track-content engagebay-track-img"><img src="https://eblink1.com/openmail?nid={{getAuthDetails "domain_id"}}&user_id={{getAuthDetails "id"}}&random_id={{random_id}}&thread_id={{thread_id}}&from_email={{from_email}}&source=web_ext" nosend="1" align="left" width="0" height="0" style="border:0;width:0px;height:0px;opacity:0;" alt=""></img></div>',

	"track-content-outlook" : '<img class="engagebay-track-image" src="https://eblink1.com/openmail?nid={{getAuthDetails "domain_id"}}&user_id={{getAuthDetails "id"}}&random_id={{random_id}}&thread_id={{thread_id}}&from_email={{from_email}}&source=web_ext" nosend="1" align="left" width="0" height="0" style="border:0;width:0px;height:0px;opacity:0;" alt=""></img>',

	"link-open" : 'https://eblink1.com/openurl?nid={{getAuthDetails "domain_id"}}&user_id={{getAuthDetails "id"}}&random_id={{random_id}}&thread_id={{thread_id}}&from_email={{from_email}}&source=web_ext&url={{encodeURL url}}',

	"templates-list" : `<div class="eb-sales-content-modal" id="templateContent">
	{{#if this.length}}
	<div class="tab-pane cont active" id="saved-email-templates">
		<div class="subdivision">
			<div id="extension-table-container">
				<table class="table table-hover" style="background: white;">
					<tbody id="extension-list-body-container"
						class="extension-list-body-container">
						{{#each this}} {{#equal template_type "TEMPLATE"}}
						<tr>
							<td id="" class="choose-template" data-t-id="{{id}}"><span
								class="ellipses" style="width: 17em; padding-left: 0px;">{{name}}</span>
							</td>
						</tr>
						{{/equal}} {{/each}}
					</tbody>
				</table>
			</div>
		</div>
		
		 {{#each this}} {{#equal template_type "FOLDER"}}
		{{#if folderTemplatesList.length}}
		<div class="subdivision">
			<h4 class="color-776f6f">{{name}}</h4>
			<div id="extension-table-container">
				<table class="table table-hover" style="background: white;">
					<tbody id="extension-list-body-container"
						class="extension-list-body-container">
						{{#each folderTemplatesList}}
						<tr>
							<td id="" class="choose-template" data-t-id="{{id}}"><span
								class="ellipses" style="width: 17em; padding-left: 0px;">{{name}}</span>
							</td>
						</tr>
						{{/each}}
					</tbody>
				</table>
			</div>
		</div>
		{{/if}} {{/equal}} {{/each}}
	</div>
	{{else}} You do not have any saved email templates {{/if}}
</div>`,

	"contact-list-template" : '<div class="eb-sales-content-modal" id="templateContent"> <div class="tab-pane cont active" id="saved-email-templates"> <div class="subdivision"> <div id="extension-table-container"> <table class="table table-hover" style="background: white;"> <tbody id="extension-list-body-container" class="extension-list-body-container"> <tr> <td id="" class="choose-list" data-list-id="0"><span class="ellipses" style="width: 17em; padding-left: 0px;">None</span> </td> </tr> {{#each this}} <tr> <td id="" class="choose-list" data-list-id="{{id}}"><span class="ellipses" style="width: 17em; padding-left: 0px;">{{name}}</span> </td> </tr> {{/each}} </tbody> </table> </div> </div> </div> </div>',
	
	"documents-list-collection" : '<div><a href="#" class="back-from-folder" style=" text-decoration: none; padding-bottom: 10px; font-size: 25px; "> &#8592; Back </a></div><div class="eb-sales-content-modal" id="documentContent"> <div id="documentErrorContainer"></div> {{#if this.length}} <table class="eb-table table-hover" style="width: 100%;"> <thead> <tr> <th></th> <th></th> <th>File Details</th> <th>Size</th> <th>Created Date</th> </tr> </thead> <tbody> </tbody> </table> {{else}} <div class="board-pad-display"> <div class="empty-pad-content-container open md-mt-30"> <div class="padcontent-image-container"> <img src="https://d2p078bqz5urf7.cloudfront.net/cloud/assets/icons/file-repository.svg"> </div> <div class="pad-help-block-container"> <div class="padcontent-help-block"> <h4 class="info-text text-left">Files</h4> <p class="pad-text">Store all your marketing and sales material in one place so your team has access to the same documents and can access easily from anywhere. Use these files in your email broadcasts and other marketing campaigns with a single click.</p> <div class=""> <div class=""> <p class="ab-pad-top-20 ab-inline-block"></p> <div class="btn-group"> <a class="btn btn-warning" href="https://{{getAuthDetails " domain_name"}}.engagebay.com/home#repository" target="_blank">Add Documents</a> </div> </div> </div> </div> </div> </div> </div> {{/if}} </div> </div> </div>',
	
	"documents-list" : '{{#each this}} <tr class="{{repo_type}}" data-id="{{mapped_folder_id}}"> <td>{{^equal repo_type "FOLDER"}}<span class="be-checkbox" style="cursor: pointer;"> <input style="vertical-align: middle;" class="eb-checkbox" type="checkbox" id="engageBayDocument_{{id}}" data-url="{{url}}" data-id="{{id}}" data-name="{{name}}{{#unless name}}{{title}}{{/unless}}" value="{{id}}" name="engagebay_document"><label for="engageBayDocument_{{id}}" style="vertical-align: middle;"></label> </span>{{/equal}}</td> <td><img style="height: 30px; width: 30px; border-radius: 50%; margin-right: 10px;" src="{{#equal repo_type "FOLDER"}}https://d2p078bqz5urf7.cloudfront.net/cloud/assets/img/file-banner-v2/folder.png{{else}}{{image_url}}{{/equal}}"></td> <td> <div class="ellipses" style="width: 15em; padding-left: 0px;"> <span class="inline-block" style="width: 10em; padding-left: 0px;text-decoration: none; color: #4285f4 !important;">{{title}}{{#unless title}}{{name}}{{/unless}}</span> </div> <div class="ellipses" style="width: 15em; padding-left: 0px; font-size: 12px; color: #999;"> <span class="cell-detail-description ellipses" style="width: 10em; padding-left: 0px; font-size: 12px; color: #999;">{{description}}</span> </div> </td> <td> <div style="width: 12em;">{{getFileSize size}}</div> </td> <td> <div style="font-size: 12px; color: #999;">{{getFormattedTime created_time}}</div> </td> </tr> {{/each}}',

	"thread-sidebar-view" : '<div class="eb-sidebar"><div class="contact-detailed-view-container"></div><div class="contact-list-view-container" style="padding: 0px 10px;"> <div> {{#each unavailable_contacts}} <div data-email="{{emailAddress}}" style="padding: 8px 8px; background: #f6f6f6; margin: 5px 0px;"> <button class="addContact add-contact-button" data-name="{{#if name}}{{name}}{{else}}{{getNameFromEmail emailAddress}}{{/if}}" data-email="{{emailAddress}}" >Add</button> <div class="ellipses" style="max-width:80%;"> {{#if name}}{{name}}{{else}}{{getNameFromEmail emailAddress}}{{/if}} </div> <div class="ellipses" style="max-width:90%;">{{emailAddress}}</div> </div> {{/each}} {{#if available_contacts.length}} <div style="border-top: 1px solid #ddd; padding-top: 5px;"> <div> {{#each available_contacts}} <div class="thread-view-contact" data-email="{{email}}" style="padding: 8px 8px; background: #f6f6f6; margin: 5px 0px;"> <div>{{name}} <img title="Added" src="{{getImageURL "images/tick.svg"}}" style="float: right;height: 12px;width: 13px;" /></div> <div>{{email}}</div> </div> {{/each}} </div> </div> {{/if}} {{#if unavailable_contacts.length}}<div style="margin: 10px 0px;"> <button class="addBulkContacts" style="width: 100%; cursor: pointer; padding: 8px 13px; color: #fff; background-color: #6a3b8d; border-color: #6a3b8d; border: transparent; border-radius: 3px;">Add to EngageBay</button> </div>{{/if}} </div> </div></div>',

	"save-email-template" : '<div class="eb-sales-content-modal"> <div> <input class="eb-form-control" name="name" placeholder="Name of the template" /> </div> <div style="min-height:100px;max-height:200px;" contenteditable="true">{{content}}</div> <div> <button class="eb-btn-primary addTemplate">add to Template</button> </div> </div>',

	"popup-loader" : '<div class="eb-sales-content-modal"><div style=" text-align: center; padding: 150px 0px; "><img src="{{getImageURL "images/loader.gif"}}" style=" margin: auto; height: 100px; width: auto; "></div></div>',

	"toolbar-popover" : '<div style="padding: 20px; width: 300px;"> <div style="padding-bottom: 20px; text-align: center;"> <img src="https://d2p078bqz5urf7.cloudfront.net/cloud/assets/img/engagebay.png" alt="logo" width="140" height="auto" class="logo-img"> </div> <div style="margin-bottom: 15px; padding-left: 60px; text-align: left; position: relative;"> <img src="{{profile_img_url}}" style="height: 45px; width: auto; border-radius: 30px; position: absolute; left: 0px; top: -5px;"> <div style="font-size: 14px; margin-bottom: 5px; font-weight: 600;"> {{name}}</div> <div style="font-size: 13px;">{{email}}</div> </div><div style="font-size: 11px;text-align: left;padding: 10px 10px;color: #949494;margin-top: 30px;border: 1px solid #f6f6f6;background: #f6f6f6;line-height: 19px;">Click <a href="https://{{getAuthDetails "domain_name"}}.engagebay.com" target="_blank">here</a> to access EngageBay account.</div> </div>',

	"login-form" : '<div class="login-form-container"> <div class="panel-heading"> <img src="https://d2p078bqz5urf7.cloudfront.net/cloud/assets/img/engagebay.png" alt="logo" width="180" height="auto" class="logo-img"> <h4>EngageBay Login</h4> </div> <form id="loginForm" class="auth-form" name="loginForm" method="POST" > <input type="hidden" name="command" value="login" /> <div id="errorBlock" class="text-danger"> </div> <div class="form-group"> <div class=""> <input class="form-control" type="email" title="Enter a valid email address." pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,5}$" name="email" autocomplete="email" placeholder="Work Email" required value="" /> </div> </div> <div class="form-group"> <div class=""> <input class="form-control" type="password" name="password" minlength="4" title="Enter at least 4 characters." minlength="20" autocomplete="off" placeholder="Password" required /> </div> </div> <div class="form-group"> <div class=""> <div class="login-submit xs-m-0 xs-pt-0"> <button class="btn btn-warning btn-lg" type="submit"> Login <img src="../images/f-loader.gif" style="display:none;"> </button> </div> </div> </div> <div class=""> Do not have an account? <a id="showSignupForm" href="#" class="text-info">Sign Up</a> </div> </form> </div>',

	"engagebay-footer" : '<div class="engagebay-footer" style="margin-top: 40px;display: block;"><div style="font-size: 11px;color: #868686;"><img src="https://d2p078bqz5urf7.cloudfront.net/cloud/assets/img/green-check.png" style="height: 13px;width: 12px;"> Sent using <a href="https://eblink1.com/website" target="_blank" style="text-decoration:none;font-size: 11px;">EngageBay</a></div></div>',

	"contact-details-view" : `<div class="header ellipses"> <span class="close close-contact-detailed-view-container"><img src="{{getImageURL "images/back-arrow.png"}}" style="height: 15px;width: auto;vertical-align: bottom;"></span> {{email}} <span class="edit-contact"><img src="{{getImageURL "images/edit.png"}}" style="height: 15px;width: auto;vertical-align: bottom;cursor:pointer;"></span> </div> <div class="body"> <div class="eb-text-center eb-mb-15"> <img class="contact-image" src="{{getGravatarImage email}}"> </div> <div class="eb-text-center eb-mb-5 eb-font-size-17 eb-text-muted ellipses">{{fullname}}</div> <div class="ellipses eb-text-center eb-mb-15 eb-text-muted eb-text-bold">{{email}}</div> <div></div><div class="border eb-mb-15"></div> <div class="contact-options-toggle"> <div class="head"> <span class="opened"><img src="{{getImageURL "images/caret-down.png"}}"></span><span class="closed"><img src="{{getImageURL "images/caret-right.png"}}"></span> About </div> <div class="content"> 
	
		{{#each properties}}
			{{#if value}} <div> <div class="about-name">{{escapeCharsInFieldName name}} {{#if subtype}}<span style="text-transform: capitalize;">
			
			({{escapeCharsInFieldName subtype}})</span>{{/if}}</div> 
			
			<div class="about-value">
			
				{{#checkIsObjStr value}}
					{{#parseObj 'value' this}}{{/parseObj}}
					{{#each value}}
						<div style="margin-bottom:5px;"><span style="text-transform:capitalize;">{{escapeCharsInFieldName @key}}</span>: {{this}}</div>
					{{/each}}
				{{else}} 
					{{decodeValue value}}
				{{/checkIsObjStr}}

			</div> </div> 
			
			{{/if}}
		
		{{/each}} 
		
		<div> <div class="about-name">Score</div> <div class="about-value">{{score}}</div> </div> {{#if tags}} <div> <div class="about-name">Tags</div> <div class="about-value">{{#each tags}}<span class="contact-tag">{{tag}}</span>{{/each}}</div> </div> {{/if}} </div> </div> <div class="contact-options-toggle deals" data-trigger-name="loadDeals"> <div class="head"> <span class="opened"><img src="{{getImageURL "images/caret-down.png"}}"></span><span class="closed"><img src="{{getImageURL "images/caret-right.png"}}"></span> Deals </div> <div class="content"></div> </div> <div class="contact-options-toggle tasks" data-trigger-name="loadTasks"> <div class="head"> <span class="opened"><img src="{{getImageURL "images/caret-down.png"}}"></span><span class="closed"><img src="{{getImageURL "images/caret-right.png"}}"></span> Tasks </div> <div class="content"></div> </div> <div class="contact-options-toggle notes" data-trigger-name="loadNotes"> <div class="head"> <span class="opened"><img src="{{getImageURL "images/caret-down.png"}}"></span><span class="closed"><img src="{{getImageURL "images/caret-right.png"}}"></span> Notes </div> <div class="content">Notes 1</div> </div> </div>`,

	"contact-deal-details-view" : '<div class="add-form-section"><div class="content1"> <span class="eb-btn eb-btn-default add-deal eb-pull-right eb-ml-5">Existing Deal</span> <span class="eb-btn eb-btn-default add-new-deal eb-pull-right eb-ml-5">Add New Deal</span> </div></div> {{#if this}}<div> {{#each this}} <div class="each-data-section"> <div class="eb-mb-5 eb-text-muted"><span class="eb-text-bold">${{amount}}</span> <span>({{milestoneLabelName}})</span></div> <div class="eb-mb-5">{{name}}</div> <div class="eb-text-light eb-font-size-11">Close Date: {{getFormattedTime closed_date}}</div></div> {{/each}} </div>{{else}} <div class="no-data-message-section">No Deals are associated with this contact</div> {{/if}} ',

	"contact-task-details-view" : '<div class="add-form-section"><div class="content1"> <span class="eb-btn eb-btn-default add-task eb-pull-right eb-ml-5">Existing Task</span> <span class="eb-btn eb-btn-default add-new-task eb-pull-right eb-ml-5">Add New Task</span>  </div> </div> {{#if this}} <div> {{#each this}} <div class="each-data-section"> <div class="eb-mb-5 eb-text-muted"><span class="eb-text-bold">{{name}}</span></div> <div class="eb-mb-5">{{task_milestone}}</div> <div class="eb-text-light eb-font-size-11">Due: {{getFormattedTime closed_date}}</div></div> {{/each}} </div> {{else}} <div class="no-data-message-section">No Tasks are associated with this contact.</div> {{/if}}',

	"contact-note-details-view" : '<div class="add-form-section"><div class="content1"> <span class="eb-btn eb-btn-default add-note eb-pull-right">Add Note</span> </div></div> {{#if this}} <div> {{#each this}} <div class="each-data-section"> <div class="eb-mb-5 eb-text-muted"><span class="eb-text-bold">{{subject}}</span></div> <div class="eb-mb-5">{{{content}}}</div> <div class="eb-text-light eb-font-size-11">{{getFormattedTime created_time}}</div></div>  {{/each}}</div> {{else}} <div class="no-data-message-section">No Notes are associated with this contact</div> {{/if}}',

	"contact-add-deal-form-view" : '<div class="contact-option-form-container">{{#unless this}}No Deals found{{else}}<select class="eb-form-control add-deal-input">{{#each this}}<option value="{{id}}">{{name}}</option>{{/each}}<select><div class="error"></div><span class="eb-btn eb-btn-default save-add-deal" style="display: inline-block;margin-top:8px;">Add Deal</span>{{/unless}}</div>',

	"contact-add-task-form-view" : '<div class="contact-option-form-container">{{#unless this}}No Tasks found{{else}}<select class="eb-form-control add-task-input">{{#each this}}<option value="{{id}}">{{name}}</option>{{/each}}<select><div class="error"></div><span class="eb-btn eb-btn-default save-add-task" style="display: inline-block;margin-top:8px;">Add Task</span>{{/unless}}</div>',

	"contact-add-note-form-view" : '<div class="contact-option-form-container"><input class="eb-form-control add-note-subject eb-mb-10" placeholder="Subject" type="text"><textarea placeholder="Note" type="text" class="eb-form-control add-note-content eb-mb-10" rows="2"></textarea><div class="error"></div><span class="save-add-note eb-btn eb-btn-default" style="display: inline-block;">Add Note</span></div>',

	"modal-popup" : '<div id="{{id}}" class="engagebay-modal"> <div class="modal-content"> <div class="modal-header"> <span class="close" id="close">&times;</span> <div>{{header}}</div> </div> <div class="modal-body contentContainer"> {{#if content}}{{content}}{{else}}<img src="{{getImageURL "images/f-loader.gif"}}">{{/if}} </div> </div> </div>',

	"edit-contact" : `<div class="eb-sales-content-drawer-view">
									<div style=" text-align: center; padding-top:50px;">
										<img src="{{getImageURL "images/loader.gif"}}" style="margin: auto; height: 50px; width: auto; ">
										</div></div>`,
										
	"form-footer" : `<div class="eb-form-group"><span class="eb-btn eb-btn-primary eb-btn-md eb-btn-space save">Save</span><span class="eb-btn eb-btn-md eb-btn-default eb-btn-space close">Cancel</span></div>`,	
	
	"tag-item-li" : `<li class="tag" data="{{#if tag}}{{tag}}{{else}}{{id}}{{/if}}">
						<span>{{#if tag}}{{tag}}{{else}}{{name}}{{/if}}</span>
						<a class="eb-close" href="javascript:void(0)">&times;</a>
					</li> `

}


function fetchRepoCollection(folderId, cursor, callback) {
	
	var json = {};
	json.page_size = 20;
	json.sort_key = '-created_time';
	if(cursor)
		json.cursor = cursor;
	if(folderId)
		json.folder_id = folderId;
	
	var url = '/api/panel/contentbox/repo';
	
	_EB_Request_Processor(
			url,
			json,
			"GET",
			function(repoData) {
				
				if(callback)
					callback(repoData);

			}, function(error) {
				console.log(error);
			});
}
