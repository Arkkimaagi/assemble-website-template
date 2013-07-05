/*jshint node:true */

module.exports.register = function(Handlebars, options) {
	var helpers = {};

	function debug(what,where){
		//console.log(what,where);
	}

	/**
	 * Renders code comments if the site.dev.verbose is true
	 * @param  {String} text   Code comments
	 * @param  {Int}    indent How many tabs to indent the code
	 * @return {String}        Either nothing, or html code comments
	 */
	helpers.verbose = function(text,indent) {
		debug("Helper:",'verbose');
		var tabs = "";
		if(typeof indent === "number"){
			tabs = new Array(indent+1).join("\t");
		}
		if(this.site && this.site.dev && this.site.dev.verbose){
			return new Handlebars.SafeString(tabs+"<!-- "+text+" -->");
		}
		return "";
	};


	for(var index in helpers){
		Handlebars.registerHelper(index, helpers[index]);
	}
	return this;
};
