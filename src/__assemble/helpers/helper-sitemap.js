/*jshint node:true */
module.exports.register = function(Handlebars, options) {
	var helpers = {};
	
	function debug(what,where){
		//console.log(what,where);
	}

	/**
	 * Generates a smart lastmod timestamp based on elapsed time
	 * @param  {Object} context The page context
	 * @return {String}         Timestamp when page was last modified, more vague if longer time has passed
	 */
	helpers.smartLastMod = function(context) {
		debug("Helper:",'smartLastMod');
		var formatD = Handlebars.helpers.formatDate;
		var now = new Date();
		
		var fs = require('fs');
		var mtime = new Date(fs.statSync(context.src).mtime);
		var lastmod = context.data.lastmod||mtime;
		
		var diff = now - lastmod;
		
		//If lastmod happens in future, use current day
		if(diff<0){
			console.log(context.dest,"lastmod happens in future? Using current day.");
			return formatD( now, "%Y-%m-%d" );
		}
		return formatD( lastmod, "%Y-%m-%dT%H:%M:%S.%z" );
	};

	/**
	 * Generates a change frequency string based on elapsed time
	 * @param  {Object} context Page context
	 * @return {String}         changefreq string that updates slower when more time has passed
	 */
	helpers.smartChangeFreq = function(context) {
		debug("Helper:",'smartChangeFreq');
		var formatD = Handlebars.helpers.formatDate;
		var now = new Date();
		
		var fs = require('fs');
		var mtime = new Date(fs.statSync(context.src).mtime);
		var lastmod = context.data.lastmod||mtime;
		
		if(context.data.changefreq){
			return context.data.changefreq;
		}
		else if(lastmod){
			var diff = now - lastmod;
			
			var day = 24*60*60*1000;
			var timescale = {
				twoDays: 2*day,
				week: 7*day,
				sixMonths: 182*day,
				year: 365*day
			};
			
			if(diff<0){
				//If lastmod happens in future, use default
				console.log(context.dest,"lastmod happens in future? Using hourly checks.");
				return "hourly";
			}else if(diff < timescale.twoDays){
				//If lastmod has happened in 2 days, lets set hourly checks
				return  "hourly";
			}else if(diff < timescale.week){
				//If lastmod has happened in 7 days, lets set daily checks
				return  "daily";
			}else if(diff < timescale.sixMonths){
				//If lastmod has happened in half a year, lets set weekly checks
				return  "weekly";
			}else if(diff < timescale.year){
				//If lastmod has happened in year, lets set monthly checks
				return  "monthly";
			}else{
				//If lastmod has happened over more than a year, lets set yearly checks
				return  "yearly";
			}
			
		}else{
			return "weekly";
		}
	};

	for(var index in helpers){
		Handlebars.registerHelper(index, helpers[index]);
	}
	return this;
};
