/*jshint node:true */
(function() {
	module.exports.register = function(Handlebars, options) {
		var helpers = {};

		/**
		 * Figure out if current navigation item is active or not
		 * @param  {Object} page_context Reference to the current page
		 * @return {String}              Either "" or "active " String to be used inside class-attribute
		 */
		helpers.code = function(codesample) {
			var ent = require('ent');
			return new Handlebars.SafeString("<code>"+ent.encode(codesample)+"</code>");
		};


		for(var index in helpers){
			Handlebars.registerHelper(index, helpers[index]);
		}
		return this;
	};
}).call(this);