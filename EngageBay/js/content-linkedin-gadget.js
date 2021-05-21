// Trigget this event from engagebay contact details page to load linkedin gadget
document.addEventListener('engagebayLoadLinkedinGadget', function(eventData) {

	if (!eventData.detail || !eventData.detail.searchTerm)
		return;

	// Load linked in frame
	loadLinkedinSearchResultFrame(eventData.detail.searchTerm,
			eventData.detail.containerId);

});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('engagebayLinkedinDataReceived', request);
	document.dispatchEvent(new CustomEvent("engagebayLinkedinDataReceived",  {
		detail : request
	} ));
})

function loadLinkedinSearchResultFrame(searchTerm, containerId) {

	var source = "https://www.linkedin.com/search/results/people/?keywords="
			+ searchTerm.trim() + "&origin=GLOBAL_SEARCH_HEADER";
	

	chrome.runtime.sendMessage({
		event : 'open_new_popup_tab',
		link : source
	}, function(response) {
		console.log(response);
	});

	/*if (true)
		return;

	var iframeContainer = document.getElementById(containerId);

	var iframeHeader = document.createElement('IFRAME');
	iframeHeader.id = 'linkedin-gadget-iframe';
	iframeHeader.width = '100%';
	iframeHeader.height = '500px';
	iframeHeader.frameBorder = 0;
	iframeContainer.innerHTML = "";

	var req = new XMLHttpRequest();
	req.open('GET', source);
	req.onload = function() {
		var dynamicURL = source;

		if (req.status == 200) {
			iframeHeader.src = dynamicURL;
			iframeContainer.appendChild(iframeHeader);
		} else {
			iframeHeader.src = "https://linkedin.com";
			iframeContainer.appendChild(iframeHeader);
		}
	};
	req.send();*/

}