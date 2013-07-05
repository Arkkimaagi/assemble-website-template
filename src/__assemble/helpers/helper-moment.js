/*jshint node:true */
module.exports.register = function(Handlebars, options) {
	var helpers = {};
	
	function debug(what,where){
		//console.log(what,where);
	}

	var moment = require('moment');
	var _ = require('lodash');
	
	helpers.moment = function(context, block){
		debug("Helper:",'moment');
		if(context && context.hash){
			block = _.cloneDeep(context);
			context = undefined;
		}
		var date = moment(context);
		
		//Reset the language back to default before doing anything else
		date.lang('en');
		
		for(var i in block.hash){
			if(date[i]){
				//console.log(
				//	i,
				//	block.hash[i],
				//	block);
				date = date[i](block.hash[i]);
			}else{
				console.log('moment.js does not support "'+i+'"');
			}
		}
		return date;
	};
	
	helpers.duration = function(context, block){
		debug("Helper:",'duration');
		if(context && context.hash){
			block = _.cloneDeep(context);
			context = 0;
		}
		//console.log(context);
		var duration = moment.duration(context);
		//Reset the language back to default before doing anything else
		duration = duration.lang('en');
		
		for(var i in block.hash){
			if(duration[i]){
				duration = duration[i](block.hash[i]);
			}else{
				console.log('moment.js duration does not support "'+i+'"');
			}
		}
		return duration;
	};

	for(var index in helpers){
		Handlebars.registerHelper(index, helpers[index]);
	}
	return this;
};
