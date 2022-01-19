!function() {
	var t = function(t, e) {
		void 0 === t && (t = "");
		var i, n = function(t, e) {
			return t = parseInt(t, 10).toString(16), e < t.length ? t
					.slice(t.length - e) : e > t.length ? Array(
					e - t.length + 1).join("0")
					+ t : t
		};
		return this.php_js || (this.php_js = {}), this.php_js.uniqidSeed
				|| (this.php_js.uniqidSeed = Math.floor(123456789 * Math
						.random())), this.php_js.uniqidSeed++, i = t, i += n(
				parseInt((new Date).getTime() / 1e3, 10), 8), i += n(
				this.php_js.uniqidSeed, 5), e
				&& (i += (10 * Math.random()).toFixed(8).toString()), i
	}, e = function(t, e, i) {
		(i = i || {}).delay = i.delay || 500, i.retries = i.retries || 30;
		var n = 0, r = function() {
			n++, t() ? e() : n <= i.retries ? setTimeout(r, i.delay)
					: i.callback_timeout && i.callback_timeout()
		};
		r()
	};
	window.engagebay_detector = t();
	var i = window.engagebay_detector, n = XMLHttpRequest.prototype, r = n.open, a = n.send;
	n.open = function(t, e) {
		return this._url = e, r.apply(this, arguments)
	}, n.send = function(n) {
	
		if (window.engagebay_detector !== i)
			return a.apply(this, arguments);

		var sid = t();
	
		if (this.addEventListener("load", function() {
		
                if (~this._url.indexOf("action=CreateItem") || ~this._url.indexOf("action=UpdateItem") && n) {
                    var t = JSON.parse(n);
                    "SendAndSaveCopy" === t.Body.MessageDisposition && top.document.dispatchEvent(new CustomEvent("engagebay_email_sent", {
                        detail: {
                        	sid : sid,
                            post: t,
                            response: this.responseText
                        }
                    }))
                } else(~this._url.indexOf("FindItem") || ~this._url.indexOf("FindConversation")) && document.dispatchEvent(new CustomEvent("engagebay_items", {
                    detail: {
                        body: this.responseText
                    }
                }))
            
            
            }), !top.document.documentElement
				.getAttribute("data-engagebay-initialized")
				|| !~this._url.indexOf("action=CreateItem")
				&& !~this._url.indexOf("action=UpdateItem") || !n)
			return a.apply(this, arguments);
		try {
			var r = JSON.parse(n);
			if ("SendAndSaveCopy" === r.Body.MessageDisposition) {
				var o = this, s = arguments;

				return top.document.dispatchEvent(new CustomEvent(
						"engagebay_email_send", {
							detail : {
								sid : sid,
								post : r
							}
						})), e(function() {
					return top.document.documentElement.getAttribute("data-" + sid + "-body-html")
				}, function() {
					
					var engagebayTemplate = top.document.documentElement.getAttribute("data-" + sid + "-body-html");
					var template = engagebayTemplate;
					
					if (-1 !== template) {
						if (r.Body.Items)
							r.Body.Items[0].Body.Value = template;
						else {
							var t = r.Body.ItemChanges[0].Updates;
							t.forEach(function(e, i) {
								e.Item && e.Item.Body
										&& (t[i].Item.Body.Value = template)
							})
						}
						
						s[0] = JSON.stringify(r)
						
						top.document.documentElement.removeAttribute("data-" + sid + "-body-html");
						
					}
					a.apply(o, s)
				}, {
					retries : 10,
					callback_timeout : function() {
						a.apply(o, s)
					}
				}), !0
			}
			return a.apply(this, arguments)
		} catch (t) {
			return a.apply(this, arguments)
		}
	}
}();