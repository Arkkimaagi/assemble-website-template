(function() {
	module.exports.register = function(Handlebars, options) {

		Handlebars.registerHelper("replace", function(original_string,look_for,replace_with,flags) {
			if(flags){
				if(typeof flags === "string"){
					look_for = new RegExp(look_for, flags);
				}else{
					look_for = new RegExp(look_for);
				}
				
			}
			return original_string.replace(look_for,replace_with);
		});

		Handlebars.registerHelper("root", function(path,options) {
			if(path !== "" && path !== "."){
				return path+"/";
			}
			return "";
		});

		Handlebars.registerHelper('contains', function(value, test, options) {
			if (value.indexOf(test) !== -1) {
				
				//console.log("contains():\n",options,this);
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		});

		Handlebars.registerHelper('nav_is_active', function(options) {
			if(this.href.replace(/index.html$/,'') === this.$_.currentPage.dest.replace(/index.html$/,'')){
				return "active ";
			}else{
				return "";
			}
		});

		Handlebars.registerHelper('doesntcontain', function(value, test, options) {
			if (value.indexOf(test) === -1) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		});

		Handlebars.registerHelper("cleanForBundle", function(original_string) {
			return original_string.replace(/^(build|src)\//,'').replace(/\.js$/,'');
		});

		Handlebars.registerHelper("debugAll", function() {
			console.log(this);
		});

		Handlebars.registerHelper("currentURL", function( options ) {
			var siteroot = new RegExp("^"+options.siteroot);
			return options.url.homepage+options.currentPage.dest.replace(siteroot,"");
		});

		Handlebars.registerHelper('$$', function ( child, parent, options ) {
			if ( typeof child !== 'object' ) {
				return '';
			}
			child['$_'] = parent;
			
			return options.fn( child );
		});

		Handlebars.registerHelper('$', function ( child, options ) {
			if ( typeof child !== 'object' ) {
				return '';
			}
			child['$_'] = this;
			
			return options.fn( child );
		});

		Handlebars.registerHelper('keys', function(obj, options) {
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
		});

		Handlebars.registerHelper("verbose", function(text,indent,options) {
			var tabs = "";
			if(typeof indent === "number"){
				tabs = new Array(indent+1).join("\t");
			}
			if(this.site.dev.verbose){
				return new Handlebars.SafeString(tabs+"<!-- "+text+" -->");
			}
			return "";
		});
		
		Handlebars.registerHelper("relatives", function(from,to,options) {
			from = from.replace(/^build\//,'');
			to = to.replace(/^build\//,'');
			var path = require('path');
			var fromDirname, relativePath, toBasename, toDirname;

			fromDirname = path.normalize(path.dirname(from));
			toDirname = path.normalize(path.dirname(to));
			toBasename = path.basename(to);
			relativePath = path.relative(fromDirname, toDirname);
			return path.join(relativePath, toBasename).replace(/\\/g, "/");
		});
		
		Handlebars.registerHelper("icon", function(symbol,title,options) {
			var ariaLabel = "";
			if(title && options){
				ariaLabel = ' aria-label="'+title+'"';
			}
			return new Handlebars.SafeString('<i class="icon icon-'+symbol+'"'+ariaLabel+'></i>');
		});
		
		
		return this;
	};

}).call(this);