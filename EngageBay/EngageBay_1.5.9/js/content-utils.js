'use strict';

function embedExtensionIdentificationElements() {

	// embedding page via content scripts to let it know
	// that they are
	// already installed
	var isInstalledNode = document.createElement('div');
	isInstalledNode.id = 'ENGAGEBAY_EXTENSION_INSTALLED';
	document.body.appendChild(isInstalledNode);
}

