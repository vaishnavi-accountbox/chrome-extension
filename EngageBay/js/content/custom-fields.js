var EB_CUSTOM_FIELDS;
function getEbCustomFields(scope, callback) {

	if (!EB_CUSTOM_FIELDS) {
		fetch();
	} else {
		getCustomFieldsByType();
	}

	function fetch() {
		_EB_Request_Processor("/api/panel/customfields/list/ALL", {}, "GET",
				function(data) {

					$.each(data, function(index, customField) {

						if (!EB_CUSTOM_FIELDS)
							EB_CUSTOM_FIELDS = {};

						if (!EB_CUSTOM_FIELDS[customField.scope])
							EB_CUSTOM_FIELDS[customField.scope] = [];

						EB_CUSTOM_FIELDS[customField.scope].push(customField);
					})

					getCustomFieldsByType();

				}, function(error) {
					console.log(error);
				});
	}

	function getCustomFieldsByType() {
		
		if (callback && typeof (callback) == "function") {
			
			if(EB_CUSTOM_FIELDS[scope])
				callback(EB_CUSTOM_FIELDS[scope]);
			else
				callback([]);
			
			return;
		}


	}

}