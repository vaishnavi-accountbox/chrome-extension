'use strict';

function authenticateUser(authCallback, unAuthCallback) {

	_EB_storage.get_local_storage(AUTH_USER_API_KEY_NAME, function(authUser) {
		
		// If auth not available retur
		if (!authUser || !Object.keys(authUser).length || !authUser.domain_name
				|| !authUser.api_key) {

			if (unAuthCallback)
				unAuthCallback();

			return;
		}

		ENGAGEBAY_AUTH_USER_DATA = authUser;


		if (authCallback)
			authCallback(authUser);

	});

}

var mailBoxPermission = {
	
	storageKey : 'disabled_mail_box_email_list',

	get: function(loggedInemail, cb) {

		_EB_storage.get_local_storage(mailBoxPermission.storageKey, function(disabledEmailList) {

			if(disabledEmailList){
				MAIL_BOX_PERMISSION_GRANTED = (JSON.parse(disabledEmailList).indexOf(loggedInemail) == -1) ? true : false;
			}else{
				MAIL_BOX_PERMISSION_GRANTED = true;
			}

			cb();

		});
	},
	enable: function(email){

		_EB_storage.get_local_storage(mailBoxPermission.storageKey, function(disabledEmailList) {

			var emails = (disabledEmailList) ? JSON.parse(disabledEmailList) : [];

			if(emails.indexOf(email) > -1)
				emails.splice(emails.indexOf(email), 1);

			_EB_storage.set_local_storage(mailBoxPermission.storageKey, JSON.stringify(emails), function(params) {
				window.location.reload();
			})

		});

	},
	disable: function(email){

		_EB_storage.get_local_storage(mailBoxPermission.storageKey, function(disabledEmailList) {

			var emails = (disabledEmailList) ? JSON.parse(disabledEmailList) : [];

			if(emails.indexOf(email) == -1)
				emails.push(email);

			_EB_storage.set_local_storage(mailBoxPermission.storageKey, JSON.stringify(emails), function(params) {
				window.location.reload();
			})

		});
	},
}

function Variable(t, e) {
	var r = new Date().getTime();
	Variable_custom(r, 'document.dispatchEvent(new CustomEvent("variable'
			+ r
			+ '",{detail:'
			+ (~t.indexOf("(") ? t : ~t.indexOf(".") ? "window." + t
					: 'window["' + t + '"]') + "}))", e)
}

function Variable_custom(t, e, r) {

	var n = function(e) {
		document.removeEventListener("variable" + t, n), i.parentNode
				.removeChild(i), r(e.detail)
	};
	document.addEventListener("variable" + t, n);
	var i = document.createElement("script");
	i.textContent = "(function(){" + e + "})()",
			(document.head || document.documentElement).appendChild(i)
}


function injectScript(path) {
	var e = document.createElement("script");
	e.src = path, (document.head || document.documentElement).appendChild(e)
}

function embedScript(t){var e=document.createElement("script");e.textContent="(function(){"+t+"})()",(document.head||document.documentElement).appendChild(e)}

function reportError(t, e, r, n, i) {
}


window.xtion = window.xtion || {};
xtion.detection = xtion.detection || {};
xtion.scroll_body = xtion.scroll_body || document.documentElement.scrollTop && document.documentElement || document.body;

function Xtion_request(e, t, n) {
    n = "string" == typeof n ? {
        post: n
    } : n || {};
    var o = Object.assign({}, n),
        r = document.getElementsByTagName("html")[0].style;
    r.cursor = "progress";
    var a = null;
    if (n.loading_overlay && (a = Xtion_popup_loading()), n.method = n.method || (n.post || n.files ? "POST" : "GET"), n.async = void 0 === n.async || n.async, n.files) {
        if (n.data = new FormData, n.post)
            if ("string" == typeof n.post && (n.post = Xtion_url_parameters(n.post)), "object" == typeof n.post)
                for (var i in n.post) n.post.hasOwnProperty(i) && n.data.append(i, n.post[i]);
            else console.log("Request Post data is invalid");
        for (var i in n.files) n.files.hasOwnProperty(i) && n.data.append(i, n.files[i])
    } else if (n.post && "object" == typeof n.post && (n.data || (n.data = n.post instanceof HTMLElement ? new FormData(n.post) : new FormData), !(n.post instanceof HTMLElement))) {
        var s = function(e, t) {
            for (var o in e)
                if (e.hasOwnProperty(o)) {
                    var r = t ? t + "[" + o + "]" : "";
                    e[o] === Object(e[o]) ? s(e[o], r || o) : n.data.append(r || o, e[o])
                }
        };
        s(n.post)
    }
    if (xtion.csrf) {
        var c = encodeURIComponent(xtion.csrf);
        n.data ? n.data.append("_t", c) : n.post ? n.post += "&_t=" + c : e += (~e.indexOf("?") ? "&" : "?") + "_t=" + c
    }
    var p = new XMLHttpRequest,
        l = (new Date)
        .getTime();
    if (p.open(n.method ? n.method : "GET", e, n.async), n.retry) {
        var u = n.error ? n.error.bind() : function() {};
        n.error = function(r) {
            n.retry_count = n.retry_count ? n.retry_count + 1 : 1, n.retry_count <= n.retry ? setTimeout(function() {
                Xtion_request(e, t, Object.assign(o, {
                    retry_count: n.retry_count
                }))
            }, "timeout" === r ? 0 : n.retry_delay || 1e3 * n.retry_count * 2) : u(r)
        }
    }
    if (!n.post || n.data || n.files || n.headers && n.headers["content-type"] || p.setRequestHeader("content-type", "application/x-www-form-urlencoded"), n.headers)
        for (var _ in n.headers) n.headers.hasOwnProperty(_) && p.setRequestHeader(_, n.headers[_]);
    if (n.timeout && (p.timeout = n.timeout), n.error && (p.ontimeout = function() {
            a && a.close(), r.cursor = "", n.error("timeout"), console.log("Request Timeout (" + ((new Date)
                .getTime() - l) / 1e3 + "s)")
        }), n.response_type && (p.responseType = n.response_type), n.xhr)
        for (var f in n.xhr) p[f] = n.xhr[f];
    p.send(n.data ? n.data : n.post);
    var d = function() {
        4 === p.readyState && (a && a.close(), r.cursor = "", 200 === p.status || n.any_status ? t && ("function" == typeof t ? t(n.response_full ? p : "blob" === n.response_type ? p.response : p.responseText) : "object" == typeof t && (t.innerHTML = p.responseText)) : (n.error && n.error(p.status), console.log("Request Failed Status " + p.status)))
    };
    return n.async ? p.onreadystatechange = d : d(), p
}


