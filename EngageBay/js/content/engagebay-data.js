function handleEngagebayFormData(el, modalViewElRef, dataJSON, options) {

	if(!dataJSON)
		dataJSON = {};
	
	// Tp prevent direct object reference
	var json = {};
	$.each(dataJSON, function(key, value) {
		json[key] = value;
	});
	
	deserializeEBForm(json, $('form', el));

	if (options.onloadCallback) {
		options.onloadCallback(el, json);
	}

	$(el)
			.on(
					'click',
					'.eb-subtype-prop-add-new',
					function() {

						var templateName = $(this).attr('data-template');
						if (!templateName)
							return;

						$(this)
								.closest('.eb-multi-subtype-properitites')
								.append(
										EngageBayCompileTemplate(
												getOtherEntityFieldTemplate(templateName),
												{}));

					});

	$(el).on('click', '.eb-subtype-prop-remove', function() {
		$(this).closest('.eb-subtype-setting').remove();
	})

	// remove tags on clear
	$(el).on('click', '.eb-typeahead-list .eb-close', function(e) {
		e.preventDefault();
		$(this).closest('li').remove();
	});
	
	$('form', el).append('<div class="eb-status-content"></div>');
	

	// initialize events
	$(el).on(
			'click',
			'.save',
			function(e) {

				e.preventDefault();

				if ($(this).attr('disabled'))
					return;

				// Send request to server
				if (!isValidForm($('form', el))) {
					return;
				}

				// merge serialize form data
				var serializeData = serializeForm($('form', el));
				
				$.each(serializeData, function(key, value) {
					json[key] = value;
				});

				// chheck data before sending to the server
				if (options.saveBeforeCallback)
					json = options.saveBeforeCallback(json);

				if (json.error) {
					// Show error
					engageBayInboxSDK.ButterBar.showError({
						text : json.error,
						time : 60000000,
						className : 'eb-status-content',
						buttons: [{
						      color: 'red',
						      onClick: () => {
						      },
						      orderHint: 1,
						      text: '',
						      title: '',
						      type: 'PRIMARY_ACTION'
						    }],
					})
					return;
				}
				
				var $that = $(this);

				$that.attr('disabled', true);

				var loadingObj = engageBayInboxSDK.ButterBar.showLoading({
					text : "Saving...",
				})

				// Send req to server
				_EB_Request_Processor(options.url, json, (json.id) ? "PUT" : "POST",
						function(resp) {

							loadingObj.destroy();

							// Show success message
							if (options.successMessage) {
								engageBayInboxSDK.ButterBar.showMessage({
									text : options.successMessage,
									time : 6000,
									buttons: [{
									      color: 'red',
									      onClick: () => {
									      },
									      orderHint: 1,
									      text: '',
									      title: '',
									      type: 'PRIMARY_ACTION'
									    }],
								})
							}

							if (options.successCallback)
								options.successCallback(json);
							
							$that.removeAttr('disabled');

							modalViewElRef.close();

						}, function(error) {

							loadingObj.destroy();

							engageBayInboxSDK.ButterBar.showError({
								text : (error.responseText) ? error.responseText : error,
								time : 6000,
								buttons: [{
								      color: 'red',
								      onClick: () => {
								      },
								      orderHint: 1,
								      text: '',
								      title: '',
								      type: 'PRIMARY_ACTION'
								    }],
							})
							
							$that.removeAttr('disabled');
							
						}, 'application/json',options.prefix);

			});

	$(el).on('click', '.close', function(e) {
		e.preventDefault();
		modalViewElRef.close();
	});

}

function contactSaveBeforeCallback(json) {

	var isTwoPrimaryEmailsExist = checkForPrimary(json);
	var isSubtypeSelected = checkIsSubtypeSelected(json);
	var ischeckForPrimaryExist = checkForSubtypeExist(json, "primary");
	var ischeckForSecondaryExist = checkForSubtypeExist(json, "secondary");
	if (!isSubtypeSelected) {
		var json1 = {};
		json1.error = "Please select subtype for all emails";
		return json1;
	}
	// If primary email not exist and secondary email exist
	// throw error
	if (!ischeckForPrimaryExist && ischeckForSecondaryExist) {
		var json3 = {};
		json3.error = "Can not add secondary email without primary email.";
		return json3;
	}
	if (!isTwoPrimaryEmailsExist) {
		var json2 = {};
		json2.error = "Only allow one primary email";
		return json2;
	}
	json.tags = [];
	if (json.tagsList && json.tagsList.length > 0) {
		$.each(json.tagsList, function(index, tag) {
			json.tags.push({
				"tag" : tag
			});
		});
	}

	var obj = {};
	var properties = json.properties;
	var isExists = false;
	var index;
	var isCountryExist = false;
	var countryIndex;
	for (var i = 0; i < properties.length; i++) {
		if (properties[i].name == "address") {
			isExists = true;
			index = i;
		}
		if (properties[i].name == "country") {
			isCountryExist = true;
			countryIndex = i;
		}
	}
	if (json.address) {
		var addressjson = {};
		var addressJSON = JSON.parse(json.address);
		if (addressJSON.address.length != 0)
			addressjson.address = addressJSON.address;
		if (addressJSON.city.length != 0)
			addressjson.city = addressJSON.city;
		if (addressJSON.state.length != 0)
			addressjson.state = addressJSON.state;
		if (addressJSON.zip.length != 0)
			addressjson.zip = addressJSON.zip;
		if (addressJSON.country.length != 0)
			addressjson.country = addressJSON.country;

		if (Object.keys(addressjson).length != 0) {
			obj.name = "address";
			obj.is_searchable = undefined;
			obj.field_type = undefined;
			obj.type = "SYSTEM";
			obj.value = JSON.stringify(addressjson);

			if (isExists) {
				json.properties[index] = obj;
			} else {
				json.properties.push(obj);
			}
		}
		if (addressjson.country != null) {
			var countryObj = {};
			countryObj.name = "country";
			countryObj.type = "SYSTEM";
			countryObj.is_searchable = false;
			countryObj.field_type = "TEXT";
			countryObj.value = addressJSON.country
			if (isCountryExist) {
				json[countryIndex] = countryObj;
			} else {
				json.properties.push(countryObj);
			}
		}
	}

	return json;
};

function getEmailArray(modelData) {
	var emailarray = [];
	var properties = modelData.properties;
	for (var i = 0; i < properties.length; i++) {
		if (properties[i].name == "email")
			emailarray.push(properties[i]);
	}
	return emailarray;
}
function checkIsSubtypeSelected(modelData) {
	var emailarray = getEmailArray(modelData);
	if (emailarray.length == 0)
		return true;

	var count = 0;
	for (var j = 0; j < emailarray.length; j++) {
		if (emailarray[j].subtype.length == 0)
			count++;
	}
	if (count == 1)
		return false;

	return true;
}

function checkForPrimary(modelData) {
	var emailarray = getEmailArray(modelData);
	if (emailarray.length == 0)
		return true;

	var count = 0;
	for (var j = 0; j < emailarray.length; j++) {
		if (emailarray[j].subtype == "primary")
			count++;
	}
	if (count > 1)
		return false;

	return true;
}

function checkForPrimaryExist(modelData) {
	var emailarray = getEmailArray(modelData);

	if (emailarray.length == 0)
		return true;

	var count = 0;
	for (var j = 0; j < emailarray.length; j++) {
		if (emailarray[j].subtype == "primary" && emailarray[j].value
				&& emailarray[j].value.trim() != "")
			count++;
	}
	if (count == 0)
		return false;

	return true;
}

function checkForSubtypeExist(modelData, subType) {
	var emailarray = getEmailArray(modelData);

	if (emailarray.length == 0)
		return true;

	var count = 0;
	for (var j = 0; j < emailarray.length; j++) {
		if (emailarray[j].subtype == subType && emailarray[j].value
				&& emailarray[j].value.trim() != "")
			count++;
	}
	if (count == 0)
		return false;

	return true;
}


function loadCompanyTags(el, data) {
	
	if (!data.companyIds || !data.companyIds.length)
		return;
	
	var $ul = $(".company-list ul", el);

	var $li = "";
	
	_EB_Request_Processor("/api/panel/subscribers/" + data.id + "/companies", {}, "GET", function(resp) {

		$.each(resp, function(index, pojo) {
			pojo.entiy_group_name = "company";
			$li += EngageBayGetAndCompileTemplate("tag-item-li", pojo)
		});

		$ul.html($li);

	}, undefined, undefined);
	
}

function fillselect($selectEl,url, data, callback, template) {
	
	if(!template)
		template = "<option value='{{id}}' {{#if selected}}selected='true'{{/if}}>{{name}}</option>";
	
	var owner = $selectEl.attr('data-value');
	var refKey = $selectEl.attr('data-ref-key');
	if(!refKey)
		refKey= 'id';
	
	var dataArr = [];
	
	if(data){
		render(data);
	}else{
		_EB_Request_Processor(url, {}, "GET", function(resp) {
			render(resp);
		}, undefined, undefined);
	}
	
	if(callback){
		
		$selectEl.on('change', function() {
			
			var selectedId = $(this).val();
			for (var i = 0; i < dataArr.length; i++) {
				if(dataArr[i][refKey]+'' == selectedId+'')
				callback(dataArr[i]);
			}
			
		});
	}
	
function render(resp) {
		
		dataArr = resp;
		
		var $li = "<option>- Select -</option>";
		$.each(dataArr, function(index, pojo) {
			
			var contextjson = pojo;
			if (owner+'' == pojo[refKey]+''){
				contextjson.selected = true;
				
				if(callback)
					callback(pojo);
			}
				
			
			$li += EngageBayCompileTemplate(template, contextjson);
			
		});

		$selectEl.html($li);
		
	}
	
}


