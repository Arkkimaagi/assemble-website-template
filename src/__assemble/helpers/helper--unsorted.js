/*jshint node:true */
module.exports.register = function(Handlebars, options) {
	var helpers = {

		"root": function(path) {
			if(path !== "" && path !== "."){
				return path+"/";
			}
			return "";
		},

		'contains': function(value, test, options) {
			if (value.indexOf(test) !== -1) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},

		'doesntcontain': function(value, test, options) {
			if (value.indexOf(test) === -1) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},

		"cleanForBundle": function(original_string) {
			return original_string.replace(/^(build|src)\//,'').replace(/\.js$/,'');
		},


		"currentURL": function( options ) {
			var siteroot = new RegExp("^"+options.siteroot);
			return options.url.homepage+options.page.dest.replace(siteroot,"").replace(/index\.html$/,'');
		},

		"$$": function( child, parent, options ) {
			if ( typeof child !== 'object' ) {
				return '';
			}
			child['$_'] = parent;
			
			return options.fn( child );
		},

		"$": function( child, options ) {
			if ( typeof child !== 'object' ) {
				return '';
			}
			child['$_'] = this;
			
			return options.fn( child );
		},

		"keys": function(obj, options) {
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
			var ariaLabel = "";
			if(title && options){
				ariaLabel = ' aria-label="'+title+'"';
			}
			return new Handlebars.SafeString('<i class="icon icon-'+symbol+'"'+ariaLabel+'></i>');
		},

		"page_exists": function(str,context,options) {
			for (var i = context.pages.length - 1; i >= 0; i--) {
				if(context.pages[i].filename === str){
					return options.fn(this);
				}
			}
			return options.inverse(this);
		}

	};

	for(var index in helpers){
		Handlebars.registerHelper(index, helpers[index]);
	}
	return this;
};
