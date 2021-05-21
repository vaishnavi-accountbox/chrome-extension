function deserializeEBForm(data, $form) {

	var formId = $form.attr("id");
	// Get all form input fields
	var $inputFieldArray = $form.find(':input');

	$inputFieldArray
			.each(function() {

				var $fel = $(this);

				if ($fel.prop("data-do-not-deserialize")
						|| $fel.attr("data-do-not-deserialize"))
					return;

				// Get name
				var name = $fel.prop('name');
				if ($fel.attr('data-name'))
					name = $fel.attr('data-name');

				// name = (!name) ? $fel.attr('data-name') : name;
				if (!name)
					return;

				// Get value based on name
				var value = getDeserializeValueFromName(name, data);
				if (!value)
					value = getDeserializeValueFromPropertiesName(name, data);

				// Reads the tag name of the field
				var tagName = $fel.prop("tagName");
				if (tagName)
					tagName = tagName.toLowerCase();
				
				addPluginToFieldType($fel);
				
				if (!value) {
					
					 if (tagName == "select") {
						var dataVal = $fel.attr('data-value');
						if (dataVal)
							$fel.val(dataVal).trigger('change');
					}
					
					return;
				}

				try {
					if (typeof value == "object"
							&& !$fel.hasClass("multi-select"))
						value = JSON.stringify(value);
				} catch (e) {
				}

				// Type of field
				var type = $fel.prop("type");

				
				/*
				 * If type of the field is text of password or hidden fills the
				 * data
				 */
				if (type == "text" || type == "url" || type == "email"
						|| type == "password" || type == "hidden"
						|| type == "number" || tagName == "textarea") {

					
						$fel.val(value);

					// Add tag selector
					if ($fel.hasClass('account-tags'))
						Account_Box_Tags_Router_Utils
								.fillTagsWithTypeahead($fel);

				}

				else if (tagName == "select") {
					addPluginToFieldType($fel);
					$fel.val(value).trigger('change');
					
					var dataVal = $fel.attr('data-value');
					if(dataVal)
						$fel.val(dataVal).trigger('change');
				}

				// Checks the checkbox if value of the filed is
				// true
				else if (type == "checkbox") {

					var isChecked = (value == 'true' || value == true || value == 'yes') ? true
							: false;

					$fel.attr("checked", isChecked);

					if ($fel.attr("value") == value)
						$fel.prop("checked", true);

				}

				/*
				 * If type of the field is "radio", then filters the field based
				 * on the value and checks it accordingly
				 */
				else if (type == "radio") {
					$fel.filter('[value="' + value + '"]').attr("checked",
							"checked");
				}

			});

	var $inputFieldPropertiesArray = $form.find('.list-field-properties');
	$inputFieldPropertiesArray
			.each(function() {
				var name = $(this).attr("name");
				var obj = data[name];
				if (!obj)
					return;

				function deserializeMultiCheckboxOptions(field, value) {
					$(field).find("input")
							.each(
									function(i2, each_field) {
										var isChecked = false;
										each_field = $(each_field);

										// Handle with comma
										var option = each_field.attr("id")
												.replace("contact_property_",
														"");
										if (field_val.split(",").length > 0) {
											if (jQuery.inArray(option, value
													.split(",")) > -1) {
												isChecked = true;
											}
										}

										each_field.attr("checked", isChecked);
										each_field.removeAttr("value");
									});
				}

				for (var i = 0; i < obj.length; i++) {
					try {
						var propName = obj[i].name;

						if (formId == "editSubscriberForm"
								&& (propName == "email" || propName == "phone" || propName == "website"))
							continue;

						$inputFieldPropertiesArray.find(
								"[property-name='" + propName + "']").val(
								obj[i].value);

						var $field = $inputFieldPropertiesArray
								.find("[property-name='" + propName + "']"), field_type = $field
								.attr("type"), field_val = obj[i].value;

						if (obj[i].subtype)
							$($field).closest(".total-property-div").find(
									".subtype").val(obj[i].subtype);

						if (!field_type)
							field_type = $field.attr("data-fieldtype");

						if (field_type && field_type == "checkbox") {
							var isChecked = (field_val == "on"
									|| field_val == 'true' || field_val == true || field_val == 'yes') ? true
									: false;
							$field.attr("checked", isChecked);
							$field.removeAttr("value");
						}

						if (field_type && field_type == "MULTICHECKBOX") {
							deserializeMultiCheckboxOptions($field, field_val);
						}

						// Add Plugin type to a field
						addPluginToFieldType($field, field_val);

					} catch (e) {
						console.error(e);
					}
				}
			});

	var $listFieldProperties = $form.find('.list-field-property');
	$listFieldProperties
			.each(function() {
				var name = $(this).attr("list-prop-name");
				var obj = data[name];
				if (!obj)
					return;
				var that = this;
				var property_name = $(this).attr("property-name");
				function deserializeMultiCheckboxOptions(field, value) {
					$(field).find("input")
							.each(
									function(i2, each_field) {
										var isChecked = false;
										each_field = $(each_field);

										// Handle with comma
										var option = each_field.attr("id")
												.replace("contact_property_",
														"");

										var dataVal = each_field
												.attr("data-value");

										if (dataVal)
											option = dataVal;

										if (field_val.split(",").length > 0) {
											if (jQuery.inArray(option, value
													.split(",")) > -1) {
												isChecked = true;
											}
										}

										each_field.attr("checked", isChecked);
										each_field.removeAttr("value");
									});
				}

				for (var i = 0; i < obj.length; i++) {
					try {
						var propName = obj[i].name;

						if (formId == "editSubscriberForm"
								&& (propName == "email" || propName == "phone" || propName == "website"))
							continue;

						if (property_name != propName)
							continue;

						$(that).val(obj[i].value);

						var $field = $(that), field_type = $field.attr("type"), field_val = obj[i].value;

						if (obj[i].subtype)
							$($field).closest(".total-property-div").find(
									".subtype").val(obj[i].subtype);

						if (!field_type)
							field_type = $field.attr("data-fieldtype");

						if (field_type && field_type == "checkbox") {
							var isChecked = (field_val == "on"
									|| field_val == 'true' || field_val == true || field_val == 'yes') ? true
									: false;
							$field.attr("checked", isChecked);
							$field.removeAttr("value");
						}

						if (field_type && field_type == "MULTICHECKBOX") {
							deserializeMultiCheckboxOptions($field, field_val);
						}

						// Add Plugin type to a field
						addPluginToFieldType($field, field_val);

					} catch (e) {
						console.error(e);
					}
				}
			});

	// Iterates through the data(which is to be populated in the form) and finds
	// field elements in the form based on the name of the field and populates
	// it. i represents key of the map, el is the value corresponding to key
	$.each(data, function(i, el) {
		try {
			// Parse el
			if (typeof el !== "object")
				el = JSON.parse(el);
		} catch (e) {
		}

		// Finds the element with name attribute same as the key
		// in the JSON data
		var fel = $form.find('*[name="' + i + '"]');

		if (fel.hasClass('multiple-checkbox')) {
			for (var i = 0; i < el.length; i++) {
				$('input:checkbox[value="' + el[i] + '"]', fel).attr("checked",
						"checked");
			}
		}

		if (isJSON(el)) {
			$.each(el, function(key, value) {
				var fel1 = $form.find('*[name="' + i + '.' + key + '"]');

				if (fel1.hasClass('multiple-checkbox')) {
					for (var j = 0; j < value.length; j++) {
						$('input:checkbox[value="' + value[j] + '"]', fel1)
								.attr("checked", "checked");
					}
				}

			});
		}

	});

	function isJSON(what) {
		return Object.prototype.toString.call(what) === '[object Object]';
	}

}

function getDeserializeValueFromName(name, data) {

	var nameLength = (name).split('.').length;
	var name = (name).split('.');

	try {
		if (data[name[0]])
			data[name[0]] = JSON.parse(data[name[0]]);
	} catch (e) {
	}

	try {

		// Construct one dimensional object
		if (nameLength == 1) {
			return data[name[0]];
		}
		// Construct two dimensional object
		else if (nameLength == 2) {
			return data[name[0]][name[1]];
		}
		// Construct three dimensional object
		else if (nameLength == 3) {
			return data[name[0]][name[1]][name[2]];
		}

	} catch (e) {
	}

	return "";
}

function getDeserializeValueFromPropertiesName(name, data) {
	if (!data.properties)
		return;

	var value;
	$.each(data.properties, function(index, eachdata) {
		if (eachdata.name == name)
			value = eachdata.value;
	});
	return value;
}

function addPluginToFieldType($field, field_val) {
	
	if($field.hasClass('typeahead'))
		engageBayTypeAhead($field);
	
	if($field.attr('type') == 'date'){
		
		let tmp = (!field_val) ? new Date(Date.now()) : new Date(field_val *1000);
		let dateInputFormatted = tmp.toISOString().split('T')[0];
		$field.val(dateInputFormatted);
	}
	
//	// Date
//	if ($field.hasClass('datetimepicker')) {
//		addDateTimePickerToEl($field, field_val);
//	}

	// Countries List
	if ($field.hasClass('countries-list')) {
		EBLoadCountriesList($field, field_val);
	}
}


//Load countries as a list
function EBLoadCountriesList(el, value) {
	var $el = $(el);
	// Load countries
	countriesDropdown2($el, function() {
		if (value)
			$el.val(value);
	});
}
