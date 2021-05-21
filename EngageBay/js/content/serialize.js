/**
 * Serialize.js is used to serialize the forms, It returns a map, with field
 * values in form mapped against field names in the form as keys. It uses jquery
 * serializeArray method to serialize field value, and also provides custom
 * serializations for fields, to get custom values form the fields.
 * 
 * @param form_id
 *            Sends form id to be serialized
 * @returns JSON returns serialized form values
 */

function serializeForm($form) {

	var arr = $form.serializeArray();

	var obj = {};

	arr = arr.concat($('.tagsinput', $form).map(function() {
		var fields_set = [];

		// Gets list of options, selected and pushes the field values in
		// to an
		// array fields_set
		$(this).find("li.tag").each(function(index, data) {

			var tagsinputVal = $(data).attr('data');
			try {
				if (isNumber(tagsinputVal))
					tagsinputVal = Number(tagsinputVal);
			} catch (e) {
			}

			fields_set.push(tagsinputVal);
		});

		var arrayIds = parseJSONArrayOfLong(fields_set);
		// For accounts multi contact selection
		// fields_set = updateAccountSharingContacts($(this), fields_set);

		if ($(this).attr("data-format") == "string") {
			arrayIds = arrayIds.join(",");
		}

		if ($(this).attr("data-stringify"))
			arrayIds = JSON.stringify(fields_set);

		if ($(this).attr('data-mode') == "single")
			arrayIds = $(this).find("li.tag:first-child").attr('data');

		// The array of selected values are mapped with the field name
		// and
		// returned as a key value pair
		return {
			"name" : $(this).attr('name'),
			"value" : arrayIds
		};
	}).get());

	/*
	 * Serializes check box, though serialization for check box is available in
	 * SerializeArray which return "on", if checked. Since it is required to
	 * return true, if check box field is checked, so serialization is
	 * customized for checkbox.
	 */
	arr = arr.concat($('input[type=checkbox]:not(.checkbox-as-array)', $form)
			.map(function() {
				return {
					"name" : $(this).attr('name'),
					"value" : $(this).is(':checked')
				}
			}).get());

	arr = arr.concat($('input[type=date]', $form).map(
			function() {
				return {
					"name" : this.name,
					"value" :new Date($(this).val()).getTime() / 1000
						
				}
			}).get());

	arr = arr.concat($('.eh-editable', $form).map(function() {
		return {
			"name" : this.name,
			"value" : $(this).editable('getValue').sequencename
		}
	}).get());

	arr = arr.concat($('.multiple-checkbox', $form).map(
			function() {
				var fields_set = [];

				$('input:checkbox:checked:not(:disabled)', this).each(
						function(index, element_checkbox) {
							fields_set.push($(element_checkbox).val());
						});

				// The array of selected values are mapped with the field name
				// and
				// returned as a key value pair
				return {
					"name" : $(this).attr('name'),
					"value" : fields_set
				};
			}).get());

	// Read all list field properties and push to array
	$form.map(
					function() {
						var fields_map = {};

						function pushToMap(name, value) {
							if (!fields_map[name]) {
								fields_map[name] = [];
							}
							fields_map[name].push(value);
						}

						function createFieldProp(data) {
							var field_json = {}, field_type = $(data).attr(
									"type");
							field_json.name = $(data).attr('property-name');
							field_json.is_searchable = $(data).attr(
									'data-searchable');
							field_json.field_type = $(data).attr(
									'data-fieldtype');
							var field_val = (field_type == "checkbox") ? $(data)
									.is(':checked')
									: $(data).val();

							if ($(data).attr("type") == 'date') {
								field_val = new Date(field_val).getTime() / 1000
							}
							
							field_json.value = field_val;
							field_json.type = $(data).attr('property-type');

							field_json.subtype = $(data).closest(
									".total-property-div").find(
									".subtype option:selected").val();

							return field_json;
						}

						// Gets list of options, selected and pushes the
						// field values in
						// to an
						// array fields_set
						$
								.each(
										$(this)
												.find(
														'input.list-field-property,select.list-field-property,textarea.list-field-property'),
										function(index, data) {
											var field_json = createFieldProp(data);
											if (field_json.name)
												pushToMap($(this).attr(
														"list-prop-name"),
														field_json)
										});

						$
								.each(
										$(this)
												.find(
														'.multiple-checkbox.list-field-property'),
										function(index, data) {
											var field_json = createFieldProp(data);
											var field_val = "", val_array = [];
											$("input", data)
													.each(
															function(i2, field2) {
																if ($(field2)
																		.is(
																				':checked')) {
																	var val = $(
																			field2)
																			.attr(
																					"id")
																			.replace(
																					"contact_property_",
																					"");

																	if ($(
																			field2)
																			.attr(
																					"data-value"))
																		val = $(
																				field2)
																				.attr(
																						"data-value");

																	val_array
																			.push(val);
																}
															});

											$(val_array).each(function(i, val) {
												if (i > 0)
													field_val += ",";
												field_val += val;
											});

											field_json.value = field_val;
											if (field_json.name)
												pushToMap($(this).attr(
														"list-prop-name"),
														field_json);
										});

						$.each(fields_map, function(name, value) {
							arr.push({
								"name" : name,
								"value" : value
							});
						});

					})

	// Converts array built from the form fields into JSON
	for (var i = 0; i < arr.length; ++i) {
		var nameLength = (arr[i].name) ? (arr[i].name).split('.').length : 0;
		var name = (arr[i].name) ? (arr[i].name).split('.') : "";

		// Construct one dimensional object
		if (nameLength == 1) {
			var temp_val = arr[i].value;

			if (obj[arr[i].name] && jQuery.type(temp_val) === "array") {
				try {
					obj[arr[i].name] = obj[arr[i].name].contact(temp_val);
				} catch (e) {
					obj[arr[i].name] = temp_val;
				}
			} else
				obj[arr[i].name] = temp_val;
		}
		// Construct two dimensional object
		else if (nameLength == 2) {

			if (!obj[name[0]])
				obj[name[0]] = {};

			obj[name[0]][name[1]] = arr[i].value;

		}
		// Construct three dimensional object
		else if (nameLength == 3) {

			if (!obj[name[0]])
				obj[name[0]] = {};

			if (!obj[name[0]][name[1]])
				obj[name[0]][name[1]] = {};

			obj[name[0]][name[1]][name[2]] = arr[i].value;

		}
	}

	var duplicateKeys = [];
	// 
	$.each(obj, function(key, data) {

		if (!key)
			delete obj[key];

		if (key.indexOf("ab-temp") > -1)
			duplicateKeys.push(key);

		if (jQuery.type(data) == "object")
			obj[key] = JSON.stringify(data)
	});

	// DELETE TEMP
	delete obj["temp"];
	$.each(duplicateKeys, function(key, data) {
		delete obj[data];
	});

	return obj;
}

function parseJSONArrayOfLong(array) {

	var newArray = [];
	$.each(array, function(index, str) {
		try {
			if (isNumber(str))
				str = Number(str);

			newArray.push(str)
		} catch (e) {

		}
	});

	return newArray;

}

function isNumber(number) {
	return (!isNaN(number));
}

/**
 * 
 * validate.js is used to validate the forms in the application, isValidFom
 * method validates the form element
 * 
 * @param form
 * @returns
 */
function isValidForm(form, err_msg_container) {

	/*
	 * jQuery.validator.addMethod("phone-number", function(value, element) {
	 * 
	 * var telInput = $(element), val = $.trim(telInput.val()); if
	 * (!telInput.attr("required") && !val) { return true; }
	 * 
	 * return (val && IntlTelInputUtils.isValid(telInput)); }, "Enter a valid
	 * Phone Number");
	 */

	$(form).validate({
		rules : {
			atleastThreeMonths : true,
			multipleEmails : true,
			email : true,
			phone : true
		},
		debug : true,
		errorElement : 'span',
		errorClass : 'help-inline',

		// Higlights the field and addsClass error if validation failed
		highlight : function(element, errorClass) {
			$(element).closest('.controls').addClass('single-error');
		},

		// Unhiglights and remove error field if validation check passes
		unhighlight : function(element, errorClass) {
			$(element).closest('.controls').removeClass('single-error');
		},
		invalidHandler : function(form, validator) {
			var errors = validator.numberOfInvalids();
		}
	});

	// Return valid of invalid, to stop from saving the data
	return $(form).valid();

}
