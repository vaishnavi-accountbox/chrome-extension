var EB_ENTITY_FIELDS;
function getEbEntityFields(entityType, data, callback) {

	if (!EB_ENTITY_FIELDS) {
		fetch();
	} else {
		getEntityFieldsByType();
	}

	function fetch() {
		_EB_Request_Processor("/api/panel/entity-fields/all", {}, "GET",
				function(data) {

					EB_ENTITY_FIELDS = {};

					if (data && data.length > 0) {
						$.each(data, function(index, prefs) {
							EB_ENTITY_FIELDS[prefs.entityType] = prefs;
						});
					}

					getEntityFieldsByType();

				}, function(error) {
					console.log(error);
				});
	}

	function getEntityFieldsByType() {

		getEbCustomFields(entityType, function(customFields) {

			var savedFields = EB_ENTITY_FIELDS[entityType].fields;
			var systemFields = getEntityFieldDefaults(entityType);

			if (!savedFields || savedFields.length == 0)
				return "";

			// gt field JSON
			var view_html = "";
			$.each(savedFields, function(index, fieldName) {
				try {

					if ($.inArray(fieldName, systemFields) != -1) {
						view_html += getSystemEntityFieldTemplate(entityType,
								fieldName, data);
					} else {

						// Get custom field from field name
						
						var custFieldData = getCustomFieldByName(customFields, fieldName)
						if(custFieldData)
							view_html += getEntityCustomFieldTemplate(custFieldData, data);
					}

				} catch (e) {
					console.warn(e);
				}
			});

			callback(view_html);

		});

	}

	function getCustomFieldByName(customFields, fieldName) {

		// gt field JSON
		var fieldData;
		$.each(customFields, function(index, field) {
			if (fieldName == field.field_name)
				fieldData = field;
		});

		return fieldData;

	}

}

function getEntityFieldDefaults(entityType) {

	const defaultFields = {
		"CONTACT" : [ 'first_name', 'last_name', 'email', 'role', 'tags',
				'company', 'phone_number', 'website', 'address' ],
		"COMPANY" : [ 'name', 'company_domain', 'phone_number', 'contacts',
				'address' ],
		"DEAL" : [ 'name', 'description', 'track', 'milestone', 'amount',
				'close_date', 'note', 'owner', 'contacts', 'companies', ],
		"TASK" : [ 'name', 'type', 'priority', 'close_date', 'email_reminder',
				'notes', 'contacts', 'companies', 'deals', 'status', 'owner' ],
	};

	return defaultFields[entityType];

}

function getSystemEntityFieldTemplate(entityType, fieldType, data) {

	const fieldTemplate = {
			
			"TASK" : {
				
				'name' : `<!--Contact Name-->
					<div class="eb-form-group">
						<label class="col-sm-3 control-label">Name <span class="ab-field-required">*</span></label>
						<div class="col-sm-9">
									<input type="text" name="name" value="{{name}}" class="eb-form-control" required placeholder="Task Name">

						</div>
					</div>`,
					
					'type' : `<div class="eb-form-group">
	<label class="col-sm-3 control-label">Type
		<span class="ab-field-required">*</span>
	</label>
	<div class="col-sm-9">
		<select id="Task_type" name="type" required="" class="eb-form-control task-type-list">
		</select>
	</div>
</div> `,
					'priority' : `<div class="eb-form-group">
	<label class="col-sm-3 control-label">Priority
		<span class="ab-field-required">*</span>
	</label>
	<div class="col-sm-9">
		<select id="taskpriority" name="task_priority" required="" class="eb-form-control">
				<option value="HIGH">High</option>
				<option value="MEDIUM">Medium</option>
				<option value="LOW">Low</option>
		</select>
	</div>
</div> `,
					'close_date' : `
					<div class="eb-form-group">
	<label class="col-sm-3 control-label">Due Date
		<span class="ab-field-required">*</span>
	</label>
	<div class="col-sm-9">
		<input type="date" id="closed-date" required="" name="closed_date" placeholder="Due Date" class="eb-form-control date datetimepicker">
	</div>
</div> `,
					'email_reminder' : `
					<div class="eb-form-group">
	<label class="col-sm-3 control-label">Email Reminder
		<span class="ab-field-required"></span>
	</label>
	<div class="col-sm-9">
		<input type="date" id="email-remonder" name="reminder_time" placeholder="Reminder Date" class="eb-form-control date datetimepicker">
	</div>
</div> `,
					'notes' : ` <div class="eb-form-group">
	<label class="col-sm-3 control-label">Notes
	</label>
	<div class="col-sm-9">
			<textarea class="eb-form-control" rows="4" required="" placeholder="Notes" name="description"></textarea>
	</div>
</div>`,
'contacts' : `<div class="eb-form-group">
<label class="col-sm-3 control-label">Contacts </label>
<div class="col-sm-9">
	<input id="contactSelectChosenAccount" name="" class="typeahead eb-form-control" placeholder="Enter Contact Name/Email" data-search="CONTACT" autocomplete="off">
    <div style="padding-top:1px;" class="contact-list typeahead-list-container">
            <ul name="contact_ids" class="tags tagsinput eb-typeahead-list">
            {{#each subscribers}} 
                {{EngageBayGetAndCompileTemplate 'tag-item-li' this}}
		 	{{/each}}
			</ul>
	</div>

</div>
</div>
<div id="addNewContact"></div>`,
'companies' : `<div class="eb-form-group">
<label class="col-sm-3 control-label">Companies </label>
<div class="col-sm-9">
	<input id="contactSelectChosenAccount" name="temp" class="typeahead eb-form-control" placeholder="Enter Company Domain/Name" data-search="COMPANY" size="40" autocomplete="off" >

    <div style="padding-top:1px;" class="company-list typeahead-list-container">
            <ul name="company_ids" class="tags tagsinput eb-typeahead-list">
            {{#each companies}} 
                {{EngageBayGetAndCompileTemplate 'tag-item-li' this}}
		 	{{/each}}
			</ul>
	</div>
</div>
</div>`,

					'deals' : `<div class="eb-form-group">
						<label class="col-sm-3 control-label">Deals </label>
						<div class="col-sm-9">
							<input id="contactSelectChosenAccount" name="temp" class="typeahead eb-form-control" placeholder="Enter Deal Name" data-search="DEAL" size="40" autocomplete="off" >

						    <div style="padding-top:1px;" class="deal-list typeahead-list-container">
						            <ul name="deal_ids" class="tags tagsinput eb-typeahead-list">
						            {{#each deals}} 
						                {{EngageBayGetAndCompileTemplate 'tag-item-li' this}}
								 	{{/each}}
									</ul>
							</div>
						</div>
						</div>`,
						
					'status' : `<div class="eb-form-group">
						<label class="col-sm-3 control-label">Status
						<span class="ab-field-required">*</span>
					</label>
					<div class="col-sm-9">
						<select id="task-status-list" required name="task_milestone" class="eb-form-control task-status-list" data-value=""{{task_milestone}}"></select>
					</div>
				</div> `,
					
					'owner' : `<div class="eb-form-group">
	<label class="col-sm-3 control-label">Owner
		<span class="ab-field-required">*</span>
	</label>
	<div class="col-sm-9">
		<select id="owners-list" required name="owner_id" class="eb-form-control owner-select-list" data-value=""{{owner_id}}"></select>
	</div>
</div> `,
			},
			
			"DEAL" : {
				
				
				'name' : `<!--Contact Name-->
	<div class="eb-form-group">
		<label class="col-sm-3 control-label">Name <span class="ab-field-required">*</span></label>
		<div class="col-sm-9">
					<input type="text" name="name" value="{{name}}" class="eb-form-control" required placeholder="Deal Name">

		</div>
	</div>`,
	
	'description' : `
	<!-- Description -->
<div class="eb-form-group">
	<label class="col-sm-3 control-label">Description</label>
	<div class="col-sm-9">
		<textarea type="text" name="description" class="eb-form-control resize-none"
				placeholder="Description" rows="3" maxlength="200"></textarea>
	</div>
</div>
`,
	'track' : `<div class="eb-form-group">
	<label class="col-sm-3 control-label">Track
		<span class="ab-field-required">*</span>
	</label>
	<div class="col-sm-9">
		<select id="pipelineList" name="track_id" class="eb-form-control track-select-list" data-value="{{track_id}}"></select>
	</div>
</div>`,
	'milestone' : `<input type="hidden"  name="milestoneLabelName" value="">
<div class="eb-form-group">
	<label class="col-sm-3 control-label">Milestone
		<span class="ab-field-required">*</span>
	</label>
	<div class="col-sm-9">
		<select name="milestoneActualName" id="milestoneList" class="eb-form-control milestone-select-list" data-ref-key="labelActualName" data-value="{{labelActualName}}"></select>
	</div>
</div>`,
	'amount' : `
	<div class="eb-form-group">
	<label class="col-sm-3 control-label">Amount
		<span class="ab-field-required">*</span>
	</label>
	 
	<div class="eb-display-flex ">

		<div style="width:30%">
		
		     <select name="currency_type" id="currency_type" class="eb-form-control" value={{currency_type}}>
					<option value="USD-$" selected="1">USD ($)</option>
					<option value="AED-Dh">AED (Dh)</option>
					<option value="ANG-&#x192;">ANG (&#x192;)</option>
					<option value="ARS-$">ARS ($)</option>
					<option value="AUD-$">AUD ($)</option>
					<option value="BGN-&#x43B;&#x432;">BGN (&#x43B;&#x432;)</option>
					<option value="BHD-BD">BHD (BD)</option>
					<option value="BND-$">BND ($)</option>
					<option value="BOB-$b">BOB ($b)</option>
					<option value="BRL-R$">BRL (R$)</option>
					<option value="BWP-P">BWP (P)</option>
					<option value="BYN-p.">BYN (p.)</option>
					<option value="CAD-$">CAD ($)</option>
					<option value="CHF-CHF">CHF (CHF)</option>
					<option value="CLP-$">CLP ($)</option>
					<option value="CNY-&#xA5;">CNY (&#xA5;)</option>
					<option value="COP-$">COP ($)</option>
					<option value="CRC-&#x20A1;">CRC (&#x20A1;)</option>
					<option value="CZK-K&#x10D;">CZK (K&#x10D;)</option>
					<option value="DKK-kr">DKK (kr)</option>
					<option value="DOP-RD$">DOP (RD$)</option>
					<option value="DZD-DA">DZD (DA)</option>
					<option value="EEK-kr">EEK (kr)</option>
					<option value="EGP-&#xA3;">EGP (&#xA3;)</option>
					<option value="EUR-&#x20AC;">EUR (&#x20AC;)</option>
					<option value="FJD-$">FJD ($)</option>
					<option value="GBP-&#xA3;">GBP (&#xA3;)</option>
					<option value="HKD-$">HKD ($)</option>
					<option value="HNL-L">HNL (L)</option>
					<option value="HRK-kn">HRK (kn)</option>
					<option value="HUF-Ft">HUF (Ft)</option>
					<option value="IDR-Rp">IDR (Rp)</option>
					<option value="ILS-&#x20AA;">ILS (&#x20AA;)</option>
					<option value="INR-Rs">INR (Rs)</option>
					<option value="ISK-ISK">ISK-ISK</option>
					<option value="JMD-J$">JMD (J$)</option>
					<option value="JOD-JOD">JOD (JOD)</option>
					<option value="JPY-&#xA5;">JPY (&#xA5;)</option>
					<option value="KES-KSh">KES (KSh)</option>
					<option value="KRW-&#x20A9;">KRW (&#x20A9;)</option>
					<option value="KWD-KD">KWD (KD)</option>
					<option value="KYD-$">KYD ($)</option>
					<option value="KZT-&#x43B;&#x432;">KZT (&#x43B;&#x432;)</option>
					<option value="LBP-&#xA3;">LBP (&#xA3;)</option>
					<option value="LKR-&#x20A8;">LKR (&#x20A8;)</option>
					<option value="LTL-Lt">LTL (Lt)</option>
					<option value="LVL-Ls">LVL (Ls)</option>
					<option value="LYD-LD">LYD (LD)</option>
					<option value="MAD-DH">MAD (DH)</option>
					<option value="MDL-MDL">MDL (MDL)</option>
					<option value="MKD-&#x434;&#x435;&#x43D;">MKD (&#x434;&#x435;&#x43D;)</option>
					<option value="MUR-&#x20A8;">MUR (&#x20A8;)</option>
					<option value="MXN-Mex$">MXN (Mex$)</option>
					<option value="MYR-RM">MYR (RM)</option>
					<option value="NAD-$">NAD ($)</option>
					<option value="NGN-&#x20A6;">NGN (&#x20A6;)</option>
					<option value="NIO-C$">NIO (C$)</option>
					<option value="NOK-kr">NOK (kr)</option>
					<option value="NPR-&#x930;&#x942;">NPR (&#x930;&#x942;)</option>
					<option value="NZD-$">NZD ($)</option>
					<option value="OMR-RO">OMR (RO)</option>
					<option value="PEN-S/.">PEN (S/.)</option>
					<option value="PGK-K">PGK (K)</option>
					<option value="PHP-&#x20B1;">PHP (&#x20B1;)</option>
					<option value="PKR-&#8360;">PKR (&#8360;)</option>
					<option value="PLN-z&#x142;">PLN (z&#x142;)</option>
					<option value="PYG-Gs">PYG (Gs)</option>
					<option value="QAR-QR">QAR (QR)</option>
					<option value="RON-lei">RON (lei)</option>
					<option value="RSD-&#1044;&#1080;&#1085;.">RSD (&#1044;&#1080;&#1085;.)</option>
					<option value="RUB-&#x440;&#x443;&#x431;">RUB (&#x440;&#x443;&#x431;)</option>
					<option value="SAR-SR">SAR (SR)</option>
					<option value="SCR-&#8360;">SCR (&#8360;)</option>
					<option value="SEK-kr">SEK (kr)</option>
					<option value="SGD-$">SGD ($)</option>
					<option value="SLL-Le">SLL (Le)</option>
					<option value="SVC-&#8353;">SVC (&#8353;)</option>
					<option value="THB-&#xE3F;">THB (&#xE3F;)</option>
					<option value="TND-TD">TND (TD)</option>
					<option value="TRY-YTL">TRY (YTL)</option>
					<option value="TTD-TT$">TTD (TT$)</option>
					<option value="TWD-NT$">TWD (NT$)</option>
					<option value="TZS-TSh">TZS (TSh)</option>
					<option value="UAH-UAH">UAH (UAH)</option>
					<option value="UGX-USh">UGX (USh)</option>
					<option value="UYU-$U">UYU $U</option>
					<option value="UZS-&#x43B;&#x432;">UZS (&#x43B;&#x432;)</option>
					<option value="VEF-VEF">VEF-VEF</option>
					<option value="VND-&#x20AB;">VND (&#x20AB;)</option>
					<option value="XOF-CFAF">XOF (CFAF)</option>
					<option value="YER-YER">YER (YER)</option>
					<option value="ZAR-R">ZAR (R)</option>
					<option value="ZMK-ZK">ZMK (ZK)</option>


		</select>
		</div>
		
		<div style="width: 70%;">
			<input type="number" name="amount" value="{{amount}}" class="eb-form-control" required placeholder="Deal Amount">
		</div>
		
	</div>
	
	
</div>

<div class="deal-products-container" style="display:none;max-height:350px;overflow-y: auto;overflow-x: auto;margin: 15px 0px;">
	
</div>
	`,
	
	'close_date' : `<div class="eb-form-group">
	<label class="col-sm-3 control-label">Close Date
		
	</label>
	<div class="col-sm-9">
		<input type="date" name="closed_date"  placeholder="Close Date" class="eb-form-control date" >
	</div>
</div>`,
	'note' : `<div class="eb-form-group ">
	<label class="col-sm-3 control-label">Note
	</label>

	<div class="col-sm-9">
			<textarea class="eb-form-control" rows="4" required="" placeholder="Note" name="note"></textarea>
	</div>

</div>`,
	'owner' : `<div class="eb-form-group">
	<label class="col-sm-3 control-label">Owner
		<span class="ab-field-required">*</span>
	</label>
	<div class="col-sm-9">
		<select id="owners-list" name="owner_id" required class="eb-form-control owner-select-list" data-value=""{{owner_id}}"></select>
	</div>
</div>`,
	'contacts' : `<div class="eb-form-group">
	<label class="col-sm-3 control-label">Contacts </label>
	<div class="col-sm-9">
		<input id="contactSelectChosenAccount" name="" class="typeahead eb-form-control" placeholder="Enter Contact Name/Email" data-search="CONTACT" autocomplete="off">
	    <div style="padding-top:1px;" class="contact-list typeahead-list-container">
                <ul name="contact_ids" class="tags tagsinput eb-typeahead-list">
                {{#each subscribers}} 
                    {{EngageBayGetAndCompileTemplate 'tag-item-li' this}}
			 	{{/each}}
				</ul>
		</div>

	</div>
</div>
<div id="addNewContact"></div>`,
	'companies' : `<div class="eb-form-group">
	<label class="col-sm-3 control-label">Companies </label>
	<div class="col-sm-9">
		<input id="contactSelectChosenAccount" name="temp" class="typeahead eb-form-control" placeholder="Enter Company Domain/Name" data-search="COMPANY" size="40" autocomplete="off" >

	    <div style="padding-top:1px;" class="company-list typeahead-list-container">
                <ul name="company_ids" class="tags tagsinput eb-typeahead-list">
                {{#each companies}} 
                    {{EngageBayGetAndCompileTemplate 'tag-item-li' this}}
			 	{{/each}}
				</ul>
		</div>
	</div>
</div>`,
				
			},

		"CONTACT" : {
			'address' : `<div class="eb-form-group" >
			<label class="col-sm-3 control-label">Address</label>
			<div class="col-sm-9">
				<input type="text" name="address.address" class="eb-form-control " maxlength="45"
					placeholder="Address" >
			</div>
		</div>
		<div class="eb-form-group" >
			<label class="col-sm-3 control-label"></label>
			<div class="col-sm-9">
				<input type="text" name="address.city" class="eb-form-control" maxlength="45"
					placeholder="City"  >
			</div>
		</div>
		<div class="eb-form-group" >
			<label class="col-sm-3 control-label"></label>
			<div class="col-sm-9">
				<input type="text" name="address.state" class="eb-form-control" maxlength="45"
					placeholder="State"  >
			</div>
		</div>
		<div class="eb-form-group" >
			<label class="col-sm-3 control-label"></label>
			<div class="col-sm-9">
				<input type="text" name="address.zip" class="eb-form-control" maxlength="45"
					placeholder="Zip code"  >
			</div>
		</div>

		<div class="eb-form-group" >
			<label class="col-sm-3 control-label"></label>
			<div class="col-sm-9">
				<select name="address.country" class="eb-form-control countries-list"
							placeholder="Country" ></select>		
			</div>
		</div>`,
				
			'company' : `
			
			<div class="eb-form-group">
			<label class="col-sm-3 control-label">Company</label>
			<div class="col-sm-9">
				<input id="contactSelectChosenAccount" name="temp" class="typeahead eb-form-control" placeholder="Enter Company Domain/Name" data-search="COMPANY" size="40" autocomplete="off" >

			    <div style="padding-top:1px;" class="company-list typeahead-list-container">
		                <ul name="companyIds" class="tags tagsinput eb-typeahead-list">
						</ul>
				</div>

			</div>
		</div>`,
			'email' : `
				<div class="eb-form-group">
				<label class="col-sm-3 control-label">Email</label>
				<div id="contactTags" class="col-sm-9">
					<div class="eb-multi-subtype-properitites">{{include_contact_email_fields properties}} </div>
				</div>
			</div>
						`,
			
				
			'first_name' : `<!--Contact Name-->
<div class="eb-form-group">
	<label class="col-sm-3 control-label">First Name <span class="ab-field-required">*</span></label>
	<div class="col-sm-9">
		<input type="text" name="{{abTempName 0}}" class="eb-form-control list-field-property" list-prop-name="properties" required maxlength="50"
			placeholder="First Name" property-name="name" property-type="SYSTEM">
	</div>
</div>`,
			'last_name' : `
<div class="eb-form-group">
	<label class="col-sm-3 control-label">Last Name</label>
	<div class="col-sm-9">
		<input type="text" name="{{abTempName 0}}" class="eb-form-control list-field-property" list-prop-name="properties" maxlength="50"
			placeholder="Last Name" property-name="last_name" property-type="SYSTEM">
	</div>
</div>`,
			
			'phone_number' : `
			
			<div class="eb-form-group">
				<label class="col-sm-3 control-label">Phone Number</label>
				<div id="contactTags" class="col-sm-9">
					<div class="eb-multi-subtype-properitites">{{include_contact_phone_fields properties}} </div>
				</div>
			</div>
			`,
			'role' : `<!-- Role -->
<div class="eb-form-group">
	<label class="col-sm-3 control-label">Role</label>
	<div class="col-sm-9">
		<input type="text" name="{{abTempName 0}}" class="eb-form-control list-field-property" list-prop-name="properties" maxlength="400"
			placeholder="Role" property-name="role" property-type="SYSTEM">
	</div>
</div>`,
			'tags' : `<!--Tags-->	
<div class="eb-form-group">
	<label class="col-sm-3 control-label">Tags</label>
	<div id="contactTags" class="col-sm-9">
		<input name="temp" class="typeahead eb-form-control" data-search="TAG" placeholder="Multiple tag names separated by comma" size="40">
		
		<div style="padding-top:1px;" class="tags-list typeahead-list-container">
            <ul name="tagsList" class="tags tagsinput eb-typeahead-list">
            	{{#each tags}}
 					{{EngageBayGetAndCompileTemplate 'tag-item-li' this}}
			    {{/each}}
			</ul>
		</div>
		
	</div>
</div>`,
			'website' : `
			<div class="eb-form-group">
				<label class="col-sm-3 control-label">Website</label>
				<div id="contactTags" class="col-sm-9">
					<div class="eb-multi-subtype-properitites">{{include_contact_website_fields properties}} </div>
				</div>
			</div>
			`,

		}
	}

	var temp = fieldTemplate[entityType][fieldType];
	if (!temp)
		return "";
	
	return EngageBayCompileTemplate(temp, data);
}

function getEntityCustomFieldTemplate(customField, data) {
	
	const fieldTemplate = {
		"TEXT" : `<div class="eb-form-group">
	<label class="" title="{{field_label}}">{{field_label}} {{#if is_required}}<span class="ab-field-required">*</span>{{/if}}</label>
	<div class="">
		<input type="text" name="{{abTempName 0}}" data-fieldtype="TEXT" data-searchable="{{is_searchable}}" class="eb-form-control list-field-property" list-prop-name="properties"
			placeholder="" property-name="{{format_field_name field_label}}" property-type="CUSTOM" {{#if is_required}}required{{/if}}>
	</div>
</div>`,
		
		"DATE" : `
		<div class="eb-form-group">
		<label >{{field_label}} {{#if is_required}}<span class="ab-field-required">*</span>{{/if}}</label>
					    <input type="date" placeholder="Select Date" data-fieldtype="DATE" data-searchable="{{is_searchable}}"  class="eb-form-control {{#if is_required}}required{{/if}} list-field-property" list-prop-name="properties" name="{{abTempName 0}}" 
					    	property-name="{{format_field_name field_label}}" property-type="CUSTOM" {{#if is_required}}required{{/if}} maxlength="100">
					</div>`,
		"NUMBER" : `<div class="eb-form-group"><label>{{field_label}} {{#if is_required}}<span class="ab-field-required">*</span>{{/if}}</label>
						<div>
							<input type="number" name="{{abTempName 0}}" data-fieldtype="NUMBER" data-searchable="{{is_searchable}}" class="eb-form-control list-field-property" list-prop-name="properties"
								placeholder="" property-name="{{format_field_name field_label}}" property-type="CUSTOM" {{#if is_required}}required{{/if}}>
						</div>
						</div>`,
						
		"LIST" : `  {{#if field_data.length}} 		
	<div class="eb-form-group">
		<label class="" title="{{field_label}}">{{field_label}} {{#if is_required}}<span class="ab-field-required">*</span>{{/if}}</label>
		<div class="">
		
		{{#convertToArray field_data 'options' this}}{{/convertToArray}}
		
			<select {{#if is_required}}required{{/if}} data-fieldtype="LIST" data-searchable="{{is_searchable}}"  name="{{abTempName 0}}" property-name="{{format_field_name field_label}}" property-type="CUSTOM" class="eb-form-control list-field-property" list-prop-name="properties">
			<option value="">Select</option>
			{{#each options}}
                <option value="{{this}}">{{this}}</option>
            {{/each}}
            </select>
		</div>
	</div>
{{/if}}`,
		"CHECKBOX" : `
							<div class="eb-form-group">
								<div class="be-checkbox">
									<input id="contact_property_{{format_field_name field_label}}" data-fieldtype="CHECKBOX" data-searchable="{{is_searchable}}" name="{{abTempName 0}}" {{#if is_required}}required{{/if}}
										type="checkbox" property-name="{{format_field_name field_label}}" property-type="CUSTOM" class=" list-field-property" list-prop-name="properties">
									<label for="contact_property_{{format_field_name field_label}}" style="font-size: 13px;"> {{field_label}}</label>
								</div>
							</div> `,
		"TEXTAREA" : ` <div class="eb-form-group">
	<label class="" title="{{field_label}}">{{field_label}} {{#if is_required}}<span class="ab-field-required">*</span>{{/if}}</label>
	<div class="">
		<textarea name="{{abTempName 0}}" data-fieldtype="TEXTAREA" data-searchable="{{is_searchable}}" class="eb-form-control resize-none {{#if is_required}}required{{/if}} list-field-property" list-prop-name="properties" 
			property-name="{{format_field_name field_label}}"  rows="3" property-type="CUSTOM" {{#if is_required}}required{{/if}}></textarea>
	</div>
</div> `,
		"FORMULA" : `  `,
		"MULTICHECKBOX" : ` {{#if field_data}} 		
	<div class="eb-form-group multiple-checkbox {{#if is_required}}required{{/if}} list-field-property" list-prop-name="properties" {{#if is_required}}min="1"{{/if}} data-searchable="{{is_searchable}}" data-fieldtype="MULTICHECKBOX" property-name="{{format_field_name field_label}}" property-type="CUSTOM">
		<label class="" title="{{field_label}}">{{field_label}}</label>
		<div class="">
		{{#convertToArray field_data 'options' this}}{{/convertToArray}}
			{{#each options}}
				{{#getRandomUniqueNumber  ../this 'index'}}{{/getRandomUniqueNumber}}
                <div class="col-sm-6 be-checkbox inline2 ellipses">
					<input id="contact_property_{{../this.index}}" data-value="{{this}}" name="{{abTempName 0}}" type="checkbox" />
					<label for="contact_property_{{../this.index}}"> {{this}}</label>
				</div>
            {{/each}}
		</div>
	</div>
{{/if}} `,
		"URL" : ` <div class="eb-form-group">
	<label class="" title="{{field_label}}">{{field_label}} {{#if is_required}}<span class="ab-field-required">*</span>{{/if}}</label>
	<div class="">
		<input type="url" name="{{abTempName 0}}" data-fieldtype="URL" data-searchable="{{is_searchable}}" class="eb-form-control list-field-property" list-prop-name="properties" maxlength="100"
			placeholder="" property-name="{{format_field_name field_label}}" property-type="CUSTOM" {{#if is_required}}required{{/if}}>
	</div>
</div> `,
		"CURRENCY" : `  `,
		"PHONE" : ` <div class="eb-form-group">
	<label class="" title="{{field_label}}">{{field_label}} {{#if is_required}}<span class="ab-field-required">*</span>{{/if}}</label>
	<div class="">
		<input type="text" name="{{abTempName 0}}" data-fieldtype="PHONE" data-searchable="{{is_searchable}}" class="eb-form-control list-field-property" list-prop-name="properties" maxlength="50"
			placeholder="" property-name="{{format_field_name field_label}}" property-type="CUSTOM" {{#if is_required}}required{{/if}}>
	</div>
</div> `,
		"TODAY_DATE" : ` <div class="eb-form-group">
	<label class="" title="{{field_label}}">{{field_label}} {{#if is_required}}<span class="ab-field-required">*</span>{{/if}}</label>
	<div class="col-sm-5">
	
	    <input type="date" placeholder="Selected Today Date" data-fieldtype="TODAY_DATE" class="eb-form-control" name="temp" 
	    	name="{{format_field_name field_label}}" property-type="CUSTOM" maxlength="100" {{#if is_required}}required{{/if}}/>
	</div>
</div> `,
		"TAX" : ` <div class="eb-form-group">
	<label class="" title="{{field_label}}">{{field_label}} {{#if is_required}}<span class="ab-field-required">*</span>{{/if}}</label>
	{{searchable}}
	<div class="">
		<input type="number" name="{{abTempName 0}}" data-fieldtype="TAX" data-searchable="{{is_searchable}}" class="eb-form-control list-field-property" list-prop-name="properties"
		 min="0"  max="100"	placeholder="" property-name="{{format_field_name field_label}}" property-type="CUSTOM" {{#if is_required}}required{{/if}}>
	</div>
</div> `,
		"FILE" : ` <label class="" title="{{field_label}}">{{field_label}} {{#if is_required}}<span class="ab-field-required">*</span>{{/if}}</label>
	<div class="">
		<input type="text" name="{{abTempName 0}}" data-fieldtype="FILE" data-searchable="{{is_searchable}}" class="eb-form-control list-field-property" list-prop-name="properties"
			placeholder="" property-name="{{format_field_name field_label}}" property-type="CUSTOM" {{#if is_required}}required{{/if}}>
	</div> `,

	}

	var temp = fieldTemplate[customField.field_type];
	if (!temp)
		return "";
	
	return EngageBayCompileTemplate(temp, customField);

}

function getOtherEntityFieldTemplate(templateName){
	
	const templates = {
						
			'add-new-email' : `
<div class="eb-form-group subscriber-email-group eb-subtype-setting">
	<label></label>
	<div class="eb-display-flex total-property-div">
		<div style="width: 30%;">
			<select name="{{abTempName 0}}" property-subtype="" data-value="{{subtype}}" class="lhs eb-form-control subtype subscriber-email-subtype list-field-property" list-prop-name="properties">
				<option value="primary" {{#equal subtype "primary"}}selected{{/equal}}>Primary</option>
				<option value="secondary" {{#equal subtype "secondary"}}selected{{/equal}}>Secondary (optional)</option>
			</select> 
		</div>
		<div style="width: 70%;">
		<input type="email" name="{{abTempName 0}}" class="eb-form-control sdads list-field-property" list-prop-name="properties" value="{{value}}"
			placeholder="Enter email address" property-name="email" property-type="SYSTEM">
		<div class="eb-subtype-prop-add-new-btn">
		<span class="eb-subtype-prop-remove sm-pr-5 eb-cursor-pointer">Remove</span>
		<span class="add-new-email eb-subtype-prop-add-new eb-cursor-pointer" data-template="add-new-email">Add new email</span>
		</div>
		</div>
		
	</div>
</div>`,
		
			'add-new-phonenumber' : `<div class="eb-form-group subscriber-phone-group eb-subtype-setting">
<label></label>
<div class="eb-display-flex  total-property-div">
	<div style="width: 30%;">
		<select name="{{abTempName 0}}" property-subtype="" data-value="{{subtype}}" class="lhs eb-form-control subtype list-field-property" list-prop-name="properties">
			   <option value="work">Work</option>
                <option value="home">Home</option>
                <option value="mobile">Mobile</option>
                <option value="main">Main</option>
                <option value="home_fax">Home Fax</option>
                <option value="work_fax">Work Fax</option>
                <option value="other">Other</option>
		</select> 
	</div>
	<div style="width: 70%;">
		<input type="text" name="{{abTempName 0}}" class="eb-form-control  sub_phone_number list-field-property" list-prop-name="properties" maxlength="45"
									placeholder="Phone Number" value="{{value}}" property-name="phone" property-type="SYSTEM" id="{{abTempName 0}}">
		<div class="eb-subtype-prop-add-new-btn">
		<span class="eb-subtype-prop-remove sm-pr-5 eb-cursor-pointer">Remove</span>
		<span class="add-new-phone eb-subtype-prop-add-new eb-cursor-pointer" data-template="add-new-phonenumber">Add new number</span>
		</div>
	</div>
	
</div>
</div>`,
		
			'add-new-website' : ` <div class="eb-form-group subscriber-website-group eb-subtype-setting" >
	<label></label>
	<div class="eb-display-flex total-property-div">
		<div style="width: 30%;">
			<select name="{{abTempName 0}}" property-subtype="{{subtype}}" data-value="{{subtype}}" class="lhs eb-form-control subtype list-field-property" list-prop-name="properties">
				<option value="URL">Website</option>
				<option value="SKYPE">Skype</option>
				<option value="TWITTER">Twitter</option>
				<option value="LINKEDIN">LinkedIn</option>
				<option value="FACEBOOK">Facebook</option>
				<option value="XING">Xing</option>
				<option value="FEED">Blog</option>
				<option value="GOOGLE-PLUS">Google+</option>
				<option value="FLICKR">Flickr</option>
				<option value="GITHUB">GitHub</option>
				<option value="YOUTUBE">YouTube</option>
			</select>
		</div>
		<div style="width: 70%;">
			<input type="text" name="{{abTempName 0}}" class="eb-form-control list-field-property" list-prop-name="properties" maxlength="150" placeholder="example.com"
				id="{{abTempName 0}}" property-name="website" property-type="SYSTEM" value="{{value}}" />
			<div class="eb-subtype-prop-add-new-btn">
				<span class="eb-subtype-prop-remove first-add-new sm-pr-5 eb-cursor-pointer">Remove</span>
				<span class="eb-subtype-prop-add-new first-add-new eb-cursor-pointer" data-template="add-new-website">Add new website</span>
			</div>
		</div>

	</div>
</div>`,
	}
	
	
	return templates[templateName];
}

Handlebars.registerHelper('include_contact_email_fields', function(properties) {
	if (properties == undefined) {
		var obj = {};
		obj.value = "";
		obj.subtype = "primary";
		var template = EngageBayCompileTemplate(getOtherEntityFieldTemplate("add-new-email"), obj);
		return new Handlebars.SafeString(template);
	} else {
		var emailarray = [];
		var str = "";
		for (var i = 0; i < properties.length; i++) {
			if (properties[i].name == "email")
				emailarray.push(properties[i]);
		}
		if (emailarray.length == 0) {
			var obj = {};
			obj.value = "";
			obj.subtype = "primary";
			var template = EngageBayCompileTemplate(getOtherEntityFieldTemplate("add-new-email"), obj);
			return new Handlebars.SafeString(template);
		}
		for (var j = 0; j < emailarray.length; j++) {
			var tem = EngageBayCompileTemplate(getOtherEntityFieldTemplate("add-new-email"), emailarray[j]);
			str += tem;
		}

		return new Handlebars.SafeString(str);
	}
});

Handlebars.registerHelper('include_contact_phone_fields', function(properties) {
	if (properties == undefined) {
		var obj = {};
		obj.value = "";
		obj.subtype = "";
		var template = EngageBayCompileTemplate(getOtherEntityFieldTemplate("add-new-phonenumber"), obj);
		return new Handlebars.SafeString(template);
	} else {
		var phonearray = [];
		var str = "";
		for (var i = 0; i < properties.length; i++) {
			if (properties[i].name == "phone")
				phonearray.push(properties[i]);
		}
		if (phonearray.length == 0) {
			var obj = {};
			obj.value = "";
			obj.subtype = "";
			var template = EngageBayCompileTemplate(getOtherEntityFieldTemplate("add-new-phonenumber"), obj);
			return new Handlebars.SafeString(template);
		}

		for (var j = 0; j < phonearray.length; j++) {
			var tem = EngageBayCompileTemplate(getOtherEntityFieldTemplate("add-new-phonenumber"), phonearray[j]);
			
			str += tem;
		}
		return new Handlebars.SafeString(str);
	}
});

Handlebars.registerHelper('include_contact_website_fields',
		function(properties) {
			if (properties == undefined) {
				var obj = {};
				obj.value = "";
				obj.subtype = "";
				var template = EngageBayCompileTemplate(getOtherEntityFieldTemplate("add-new-website"), obj);
				return new Handlebars.SafeString(template);
			} else {
				var websitearray = [];
				var str = "";
				for (var i = 0; i < properties.length; i++) {
					if (properties[i].name == "website")
						websitearray.push(properties[i]);
				}

				if (websitearray.length == 0) {
					var obj = {};
					obj.value = "";
					obj.subtype = "";
					var template = EngageBayCompileTemplate(getOtherEntityFieldTemplate("add-new-website"), obj);
					return new Handlebars.SafeString(template);
				}

				for (var j = 0; j < websitearray.length; j++) {
					var tem = EngageBayCompileTemplate(getOtherEntityFieldTemplate("add-new-website"),
							websitearray[j]);
					
					str += tem;
				}
				return new Handlebars.SafeString(str);
			}
		});

