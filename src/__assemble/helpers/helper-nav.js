/*jshint node:true */
module.exports.register = function(Handlebars, options) {
	var helpers = {};
	
	function debug(what,where){
		//console.log(what,where);
	}

	/**
	 * Figure out if current navigation item is active or not
	 * @param  {Object} page_context Reference to the current page
	 * @return {String}              Either "" or "active " String to be used inside class-attribute
	 */
	helpers.nav_is_active = function(page_context) {
		debug("Helper:",'nav_is_active');
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
		debug("Helper:",'nav_relatives');
		
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

	/**
	 * Create relative path from here to target path and strip index.html
	 * @param  {String} from Page linking from
	 * @param  {String} to   Page linked to
	 * @return {String}      Relative path to destination without index.html in the end.
	 */
	helpers.relative_strip = function(from, to) {
		debug("Helper:",'relative_strip');
		return Handlebars.helpers.relative(from,to.replace(/\/index.html$/i,'/'));
	};

	/**
	 * Render block, if current folder depth is high enough
	 * @param  {Integer} level  Depth limit
	 * @param  {Object} options Internal object
	 * @return {Object}         Renders block if depth level is above limit
	 */
	helpers.if_depth_gt = function(level,options) {
		debug("Helper:",'if_depth_gt');
		if(this.dirname.split('/').length>level){
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	};


	/**
	 * Creates breadcrumbs for current level
	 * @param  {Object} options Internal object
	 * @return {String}         Rendered breadcrumbs for current level
	 */
	helpers.breadcrumbs = function(options) {
		debug("Helper:",'breadcrumbs');
		var dirs = {};
		for(var i in this.pages){
			var iPage = this.pages[i];
			var iDest = iPage.dest.replace(/\/index\.html$/i,"\/");
			dirs[iDest] = iPage;
		}
		
		var tDest = this.page.dest.replace(/\/index\.html$/i,"\/");
		var tDestSplit = tDest.split("/");
		var tDestSplitLength = tDestSplit.length;
		
		var result = "";
		
		for(i = 0; i<tDestSplitLength; i++){
			var pathSegment = tDestSplit.slice(0,i).join('/')+"/";
			if(dirs[pathSegment]){
				var obj = {};
				obj.title = dirs[pathSegment].data.title;
				if(pathSegment === tDest){
					obj.active = true;
				} else {
					obj.href = dirs[pathSegment].dest;
					obj.href = Handlebars.helpers.relative(this.page.dest,obj.href);
					obj.href = obj.href.replace(/\/index\.html$/i,"\/");
				}
				result += options.fn(obj);
			}
		}
		return result;
	};

	for(var index in helpers){
		Handlebars.registerHelper(index, helpers[index]);
	}
	return this;
};
