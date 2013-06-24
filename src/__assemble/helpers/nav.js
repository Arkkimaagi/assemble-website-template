/*jshint node:true */
(function() {
	module.exports.register = function(Handlebars, options) {
		var helpers = {};

		/**
		 * Figure out if current navigation item is active or not
		 * @param  {Object} page_context Reference to the current page
		 * @return {String}              Either "" or "active " String to be used inside class-attribute
		 */
		helpers.nav_is_active = function(page_context) {
			try{
				
				var item_href = this.href.replace(/index.html$/,'');
				
				var page_href = page_context.page.dest;
				var siteroot = new RegExp("^build/");
				page_href = page_href.replace(siteroot,'');
				
				var partialmatch = new RegExp('^'+item_href);
				
				//If the current page is a subpage of the linked page
				if(page_href.match(partialmatch)){
					return "active ";
				}
				
				page_href = page_href.replace(/index.html$/,'');
				
				if(item_href === page_href){
					return "active ";
				}else{
					return "";
				}
				
			}catch(e){
				console.error('nav_is_active','-helper failed!');
				throw(e);
			}
		};

		/**
		 * Create relative path from here to target path
		 * @param  {String} page_context Current page context
		 * @return {String}              Relative path between current page and target location
		 */
		helpers.nav_relatives = function(page_context) {
			
			var from = page_context.page.dest.replace(/^build\//,'');
			var to = this.href.replace(/^build\//,'');
			var path = require('path');
			var fromDirname, relativePath, toBasename, toDirname;
			
			fromDirname = path.normalize(path.dirname(from));
			toDirname = path.normalize(path.dirname(to));
			relativePath = path.relative(fromDirname, toDirname);
			toBasename = path.basename(to);
			
			return path.join(relativePath, toBasename).replace(/\\/g, "/");
		};

		for(var index in helpers){
			Handlebars.registerHelper(index, helpers[index]);
		}
		return this;
	};
}).call(this);