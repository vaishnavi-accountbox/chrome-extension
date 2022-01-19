function connectToChannel(channelId) {

	/*var api_key = "Kqsf0w.34IwNQ:Q_SqweJDEzophFrA";

	var realtime = new Ably.Realtime(api_key);

	var channel = realtime.channels.get(channelId);

	channel.subscribe(function(msg) {

		//console.log("On subscribed to channel ", channelId);

		showNotification(msg)

	});*/

	//https://messaging-public.realtime.co/js/2.1.0/ortc.js https://ortc-developers.realtime.co/server/ssl/2.1/


	/*ortcClient = RealtimeMessaging.createClient();

	ortcClient
		.setClusterUrl('https://ortc-developers.realtime.co/server/ssl/2.1/');
	ortcClient.connect('xkxqGd', 'myAuthenticationToken');
	ortcClient.onConnected = function (ortc) {
		console.log("Connected to " + ortcClient.getUrl());
		subscribeToRoom(channelId);
		
	};
	*/

	subscribeToPusherChannelService(channelId);

}


function subscribeToPusherChannelService(roomName) {
	roomName = roomName + "";
	var eventName = "engagebay-event";

	function subscribeToRoom() {
		if (!ortcClient)
			return;

		// For livechat
		var channel = ortcClient.subscribe(roomName);
		channel.bind(eventName, function (message, channel, ortc) {
			try {
				var messageJSON = JSON.parse(message);
				console.log(messageJSON);
				showNotification(messageJSON.message);
				
			} catch (e) {
				console.error(e);
			}
		});
	}


	ortcClient = new Pusher('1bd6d84d7a6d517eeee5', {
		cluster: 'ap2',
		forceTLS: true
	});

	ortcClient.connection.bind('state_change', function (states) {
		// states = {previous: 'oldState', current: 'newState'}
		console.log("States ", states);
	});

	subscribeToRoom();

}



	function showNotification(msgJson) {

		if (!msgJson)
			return;

		var notyJson = {};

		var recipient

		if (msgJson.type == "BROWSER_EXT_DOCUMENT_OPENED") {
			notyJson.title = "Attachment Viewed";
			notyJson.body = getRecipientName(msgJson.info) + " has viewed - "
				+ getPropertyValue(msgJson.info, 'document_name')
		}

		if (msgJson.type == "BROWSER_EXT_EMAIL_OPENED") {

			var subject = getPropertyValue(msgJson.info, 'subject');
			if (!subject)
				subject = "(no subject)";

			notyJson.title = "Email Opened";
			notyJson.body = getRecipientName(msgJson.info) + " has opened email - "
				+ subject;
		}

		if (msgJson.type == "BROWSER_EXTENSION_EMAIL_ATTACHMENT_DOWNLOADED_BY_SOMEONE") {
			notyJson.title = "Attachment Downloaded";
			notyJson.body = getRecipientName(msgJson.info) + " has downloaded - "
				+ getPropertyValue(msgJson.info, 'document_name')
		}

		if (msgJson.type == "BROWSER_EXTENSION_EMAIL_LINK_CLICKED") {
			notyJson.title = "Link Clicked";

			var url = "";
			try {
				url = JSON.parse(msgJson.misc_info).url;
			} catch (e) {
			}

			notyJson.body = getRecipientName(msgJson.info) + " has clicked - "
				+ url;
		}

		_EB_Background.create_notification(notyJson);

	}

	function getRecipientName(info) {

		var recipients = getPropertyValue(info, 'recipients');

		try {

			recipients = JSON.parse(recipients);

			if (!recipients || recipients.length == 0)
				return "Someone";

		} catch (e) {
			return "Someone";
		}

		if (recipients.length > 1)
			return "Someone";

		var name = recipients[0].name;
		if (!name || name === null)
			name = recipients[0].emailAddress.match(/^([^@]*)@/)[1];

		if (name)
			return name;

		return recipients[0].emailAddress;

	}