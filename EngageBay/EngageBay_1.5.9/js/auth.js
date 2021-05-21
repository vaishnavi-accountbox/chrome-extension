'use strict';

function authenticateLoginUser(json, callback, errorCallback) {
	json.request_from = 'BROWSER_EXTENSION';
	_EB_Request_Processor(
			getEngageBayDomainPath("app") + "/rest/api/login/get-domain", json,
		"POST", callback, errorCallback);

	//_EB_Request_Processor("http://localhost:8888/rest/api/login/get-domain",
	//	json, "POST", callback, errorCallback);

}

function authenticateSignUpUser(json, callback, errorCallback) {
	json.request_from = 'BROWSER_EXTENSION';
	
	
	_EB_Request_Processor(
		getEngageBayDomainPath("app") + "/rest/api/signup/signup-user", json,
		"POST", callback, errorCallback);

	// _EB_Request_Processor("http://localhost:8888/rest/api/signup/signup-user",
	// json, "POST", callback, errorCallback);
}

function generateLoginVerificationCode(json, callback, errorCallback) {
	_EB_Request_Processor(
			getEngageBayDomainPath("app") + "/rest/api/login/send-login-verification-code", json,
			"POST", callback, errorCallback);
}
