/*jshint node:true */
(function() {
	module.exports.register = function(Handlebars, options) {
		var helpers = {

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
				var urlroot = new RegExp("^"+options.urlroot.replace(/\/index.html$/,'/'));
				return options.url.homepage+options.page.dest.replace(urlroot,"").replace(/index\.html$/,'');
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
			}

		};

		for(var index in helpers){
			Handlebars.registerHelper(index, helpers[index]);
		}
		return this;
	};
}).call(this);
