/*jshint node:true */

module.exports.register = function(Handlebars, options) {
	var helpers = {};
	
	function debug(what,where){
		//console.log(what,where);
	}

	
	helpers.replace = function(original_string,look_for,replace_with,flags) {
		debug("Helper:",'replace');
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
		debug("Helper:",'match');
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
	};


	for(var index in helpers){
		Handlebars.registerHelper(index, helpers[index]);
	}
	return this;
};
