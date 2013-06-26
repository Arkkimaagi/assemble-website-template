/*jshint node:true */
(function() {
	module.exports.register = function(Handlebars, options) {
		var helpers = {};

		
		helpers.replace = function(original_string,look_for,replace_with,flags) {
			if(flags){
				if(typeof flags === "string"){
					look_for = new RegExp(look_for, flags);
				}else{
					look_for = new RegExp(look_for);
				}
				
			}
			return original_string.replace(look_for,replace_with);
		};

		
		helpers.match = function(original_string,look_for,flags,options) {
			if(flags){
				if(typeof flags === "string"){
					look_for = new RegExp(look_for, flags);
				}else{
					look_for = new RegExp(look_for);
				}
			}else{
				options = flags;
			}
			var match = original_string.match(look_for);
			if(match){
				this.match = match;
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
			//return original_string.match(look_for);
		};


		for(var index in helpers){
			Handlebars.registerHelper(index, helpers[index]);
		}
		return this;
	};
}).call(this);