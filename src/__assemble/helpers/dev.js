/*jshint node:true */
(function() {
	module.exports.register = function(Handlebars, options) {
		var helpers = {};

		helpers.verbose = function(text,indent) {
			//console.log("verbose");
			var tabs = "";
			if(typeof indent === "number"){
				tabs = new Array(indent+1).join("\t");
			}
			if(this.site.dev.verbose){
				return new Handlebars.SafeString(tabs+"<!-- "+text+" -->");
			}
			return "";
		};

		helpers.debugThis = function(target) {
			//console.log("debugThis");
			if(!target){
				target = this;
			}
			console.log(target);
		};

		for(var index in helpers){
			Handlebars.registerHelper(index, helpers[index]);
		}
		return this;
	};
}).call(this);