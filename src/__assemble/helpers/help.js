/*jshint node:true */
(function() {
	module.exports.register = function(Handlebars, options) {
		var helpers = {

			"replace": function(original_string,look_for,replace_with,flags) {
				//console.log("replace");
				if(flags){
					if(typeof flags === "string"){
						look_for = new RegExp(look_for, flags);
					}else{
						look_for = new RegExp(look_for);
					}
					
				}
				return original_string.replace(look_for,replace_with);
			},

			"root": function(path) {
				//console.log("root");
				if(path !== "" && path !== "."){
					return path+"/";
				}
				return "";
			},

			'contains': function(value, test, options) {
				//console.log('contains');
				if (value.indexOf(test) !== -1) {
					
					//console.log("contains():\n",options,this);
					return options.fn(this);
				} else {
					return options.inverse(this);
				}
			},

			'doesntcontain': function(value, test, options) {
				//console.log('doesntcontain');
				if (value.indexOf(test) === -1) {
					return options.fn(this);
				} else {
					return options.inverse(this);
				}
			},

			"cleanForBundle": function(original_string) {
				//console.log("cleanForBundle");
				return original_string.replace(/^(build|src)\//,'').replace(/\.js$/,'');
			},


			"currentURL": function( options ) {
				//console.log("currentURL");
				var siteroot = new RegExp("^"+options.siteroot);
				return options.url.homepage+options.page.dest.replace(siteroot,"").replace(/index\.html$/,'');
			},

			"$$": function( child, parent, options ) {
				//console.log("$$");
				if ( typeof child !== 'object' ) {
					return '';
				}
				child['$_'] = parent;
				
				return options.fn( child );
			},

			"$": function( child, options ) {
				//console.log("$");
				if ( typeof child !== 'object' ) {
					return '';
				}
				child['$_'] = this;
				
				return options.fn( child );
			},

			"keys": function(obj, options) {
				//console.log("keys",options);
				var key, result, value;
				
				result = '';
				for (key in obj) {
					value = obj[key];
					result += options.fn({
						key: key,
						val: value
					});
				}
				return result;
			},

			"icon": function(symbol,title,options) {
				//console.log("icon");
				var ariaLabel = "";
				if(title && options){
					ariaLabel = ' aria-label="'+title+'"';
				}
				return new Handlebars.SafeString('<i class="icon icon-'+symbol+'"'+ariaLabel+'></i>');
			},

			"page_exists": function(str,context,options) {
				for (var i = context.pages.length - 1; i >= 0; i--) {
					if(context.pages[i].filename === str){
						//console.log("yes");
						return options.fn(this);
					}
				}
				//console.log("no");
				return options.inverse(this);
			},

			"smartLastMod": function(context) {
				var formatD = Handlebars.helpers.formatDate;
				var now = new Date();
				
				if(context.data.lastmod){
					var lastmod = context.data.lastmod;
					var diff = now - lastmod;
					
					var day = 24*60*60*1000;
					var timescale = {
						twoDays: 2*day,
						week: 7*day,
						sixMonths: 182*day,
						year: 365*day
					};
					
					if(diff<0){
						
						//If lastmod happens in future, use default
						console.log(context.dest,"lastmod happens in future? Using current day.");
						return formatD( now, "%Y-%m-%d" );
						
					}else if(diff < timescale.twoDays){
						
						//If lastmod has happened in 2 days, lets set hourly timestamp
						return formatD( lastmod, "%Y-%m-%dT%H:%M:%S.%z" );
						
					}else if(diff < timescale.week){
						
						//If lastmod has happened in 7 days, lets set daily timestamp
						return formatD( lastmod, "%Y-%m-%d" );
						
					}
					
				}else{
					return formatD( now, "%Y-%m-%d" );
				}
				
			},
			
			"smartChangeFreq": function(context) {
				var formatD = Handlebars.helpers.formatDate;
				var now = new Date();
				if(context.data.changefreq){
					return context.data.changefreq;
				}
				else if(context.data.lastmod){
					var lastmod = context.data.lastmod;
					var diff = now - lastmod;
					
					var day = 24*60*60*1000;
					var timescale = {
						twoDays: 2*day,
						week: 7*day,
						sixMonths: 182*day,
						year: 365*day
					};
					
					if(diff<0){
						//If lastmod happens in future, use default
						console.log(context.dest,"lastmod happens in future? Using hourly checks.");
						return "hourly";
					}else if(diff < timescale.twoDays){
						//If lastmod has happened in 2 days, lets set hourly checks
						return  "hourly";
					}else if(diff < timescale.week){
						//If lastmod has happened in 7 days, lets set daily checks
						return  "daily";
					}else if(diff < timescale.sixMonths){
						//If lastmod has happened in half a year, lets set weekly checks
						return  "weekly";
					}else if(diff < timescale.year){
						//If lastmod has happened in year, lets set monthly checks
						return  "monthly";
					}else{
						//If lastmod has happened over more than a year, lets set yearly checks
						return  "yearly";
					}
					
				}else{
					return "weekly";
				}
				
			}
			

		};

		for(var index in helpers){
			Handlebars.registerHelper(index, helpers[index]);
		}
		return this;
	};
}).call(this);