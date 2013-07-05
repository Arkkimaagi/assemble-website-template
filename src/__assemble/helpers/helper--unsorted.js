/*jshint node:true */
module.exports.register = function(Handlebars, options) {
	var helpers = {};

	function debug(what,where){
		//console.log(what,where);
	}

	helpers.root = function(path) {
		debug('Helper:','root');
		if(path !== "" && path !== "."){
			return path+"/";
		}
		return "";
	};

	helpers.contains = function(value, test, options) {
		debug('Helper:','contains');
		if (value.indexOf(test) !== -1) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	};

	helpers.doesntcontain = function(value, test, options) {
		debug('Helper:','doesntcontain');
		if (value.indexOf(test) === -1) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	};

	helpers.cleanForBundle = function(original_string) {
		debug('Helper:','cleanForBundle');
		return original_string.replace(/^(build|src)\//,'').replace(/\.js$/,'');
	};


	helpers.currentURL = function( options ) {
		debug('Helper:','currentURL');
		var siteroot = new RegExp("^"+options.siteroot);
		return options.url.homepage+options.page.dest.replace(siteroot,"").replace(/index\.html$/,'');
	};

	helpers.$$=  function( child, parent, options ) {
		debug('Helper:','$$":');
		if ( typeof child !== 'object' ) {
			return '';
		}
		child['$_'] = parent;
		
		return options.fn( child );
	};

	helpers.$=  function( child, options ) {
		debug('Helper:','$":');
		if ( typeof child !== 'object' ) {
			return '';
		}
		child['$_'] = this;
		
		return options.fn( child );
	};

	helpers.keys = function(obj, options) {
		debug('Helper:','keys');
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
	};

	helpers.icon = function(symbol,title,options) {
		debug('Helper:','icon');
		var ariaLabel = "";
		if(title && options){
			ariaLabel = ' aria-label="'+title+'"';
		}
		return new Handlebars.SafeString('<i class="icon icon-'+symbol+'"'+ariaLabel+'></i>');
	};

	helpers.page_exists = function(str,context,options) {
		debug('Helper:','page_exists');
		for (var i = context.pages.length - 1; i >= 0; i--) {
			if(context.pages[i].filename === str){
				return options.fn(this);
			}
		}
		return options.inverse(this);
	};


	for(var index in helpers){
		Handlebars.registerHelper(index, helpers[index]);
	}
	return this;
};
