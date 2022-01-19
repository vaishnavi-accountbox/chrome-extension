'use strict';

$(document)
		.ready(
				function() { /* code here */

					// embedding page via content scripts to let it know that
					// they are
					// already installed
					try {
						if (window.location.hostname.indexOf(".engagebay.com") != -1 || window.location.hostname.indexOf(".appspot.com") != -1
								|| window.location.hostname
										.indexOf("localhost") != -1) {
							embedExtensionIdentificationElements();
						}

					} catch (e) {
					}

				});

