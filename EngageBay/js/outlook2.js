(function(){
	var Uniqid=function(e,t){typeof e=="undefined"&&(e="");var n,r=function(e,t){return e=parseInt(e,10).toString(16),t<e.length?e.slice(e.length-t):t>e.length?Array(1+(t-e.length)).join("0")+e:e};return this.php_js||(this.php_js={}),this.php_js.uniqidSeed||(this.php_js.uniqidSeed=Math.floor(Math.random()*123456789)),this.php_js.uniqidSeed++,n=e,n+=r(parseInt((new Date).getTime()/1e3,10),8),n+=r(this.php_js.uniqidSeed,5),t&&(n+=(Math.random()*10).toFixed(8).toString()),n};
	var Interval_retry=function(callback_test,callback,options){options=options||{};options.delay=options.delay||500;options.retries=options.retries||30;
		var retries=0;var f=function(){retries++;if(callback_test()){callback()}else if(retries<=options.retries){setTimeout(f,options.delay)}else if(options.callback_timeout){options.callback_timeout()}};f()
	};

	window.engagebay_detector=Uniqid();var detector=window.engagebay_detector;

	var fetch_old=fetch;window.fetch=function(url,options){if(window.engagebay_detector===detector){
		if((~url.indexOf('action=CreateItem')||~url.indexOf('action=UpdateItem'))&&top.document.documentElement.getAttribute('data-engagebay-initialized')&&options&&options.body){
			try{
				
			var d=JSON.parse(options.body);
			
			if(d['Body']['MessageDisposition']==='SendAndSaveCopy'){
				
				var r=this;var args=arguments;var sid=Uniqid();//noinspection JSCheckFunctionSignatures
				
				top.document.dispatchEvent(new CustomEvent('engagebay_email_send',{detail:{sid:sid,post:d}}));
				
				return new Promise(function(resolve,reject){
					
					// console.log("top[sid + body_html]", top.document.documentElement.getAttribute("data-" + sid + "-body-html"));
					
					Interval_retry(function(){return top.document.documentElement.getAttribute("data-" + sid + "-body-html")},function(){
						
						if(top.document.documentElement.getAttribute("data-" + sid + "-body-html")!==-1){
							
							if(d['Body']['Items']){
								
								if(d['Body']['Items'][0]['Body']){d['Body']['Items'][0]['Body']['Value']=top.document.documentElement.getAttribute("data-" + sid + "-body-html");}
								else if(d['Body']['Items'][0]['NewBodyContent']){d['Body']['Items'][0]['NewBodyContent']['Value']=top.document.documentElement.getAttribute("data-" + sid + "-body-html");}
								
							}
							else{
								var c=d['Body']['ItemChanges'][0]['Updates'];
								c.forEach(function(v,k){
									if(v['Item']&&v['Item']['Body']){c[k]['Item']['Body']['Value']=top.document.documentElement.getAttribute("data-" + sid + "-body-html")}
								})}
							
							options.body=JSON.stringify(d);
							
							top.document.documentElement.removeAttribute("data-" + sid + "-body-html")

						}
						
						var prom=fetch_old.apply(this,args);
						prom.then(function(response){
							response.clone().text().then(function(r){document.dispatchEvent(new CustomEvent('engagebay_email_sent',{detail:{sid:sid, response:r}}));});
							return response;
						});
						resolve(prom);
					},{retries:10,callback_timeout:function(){fetch_old.apply(r,args)}});
				});
			}
			else{
				return fetch_old.apply(this,arguments)}}catch(e){console.error(e);return fetch_old.apply(this,arguments)}
		}
		else{
			var promise=fetch_old.apply(this,arguments);
			promise.then(function(response){
				if(~response.url.indexOf('action=FindItem')||~response.url.indexOf('action=FindConversation')){response.clone().text().then(function(r){document.dispatchEvent(new CustomEvent('engagebay_items',{detail:{body:r}}));})}

				return response;
			});return promise;
		}
	}else{return fetch_old.apply(this,arguments)}};

	var x=XMLHttpRequest.prototype,open=x.open,send=x.send;x.open=function(m,u){this._url=u;return open.apply(this,arguments)};x.send=function(data){if(window.engagebay_detector===detector){//noinspection JSUnresolvedFunction
		this.addEventListener('load',function(){});
		return send.apply(this,arguments);
	}else{return send.apply(this,arguments)}};
})();