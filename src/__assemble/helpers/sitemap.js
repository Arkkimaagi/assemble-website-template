/*jshint node:true */
(function() {
	module.exports.register = function(Handlebars, options) {
		var helpers = {};

		/**
		 * Generates a smart lastmod timestamp based on elapsed time
		 * @param  {Object} context The page context
		 * @return {String}         Timestamp when page was last modified, more vague if longer time has passed
		 */
		helpers.smartLastMod = function(context) {
			var formatD = Handlebars.helpers.formatDate;
			var now = new Date();
			
			if(context.data.lastmod){
				var lastmod = context.data.lastmod;
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
					console.log(context.dest,"lastmod happens in future? Using current day.");
					return formatD( now, "%Y-%m-%d" );
					
				}else if(diff < timescale.twoDays){
					
					//If lastmod has happened in 2 days, lets set hourly timestamp
					return formatD( lastmod, "%Y-%m-%dT%H:%M:%S.%z" );
					
				}else if(diff < timescale.week){
					
					//If lastmod has happened in 7 days, lets set daily timestamp
					return formatD( lastmod, "%Y-%m-%d" );
					
				}
				
			}else{
				return formatD( now, "%Y-%m-%d" );
			}
			
		};

		/**
		 * Generates a change frequency string based on elapsed time
		 * @param  {Object} context Page context
		 * @return {String}         changefreq string that updates slower when more time has passed
		 */
		helpers.smartChangeFreq = function(context) {
			var formatD = Handlebars.helpers.formatDate;
			var now = new Date();
			if(context.data.changefreq){
				return context.data.changefreq;
			}
			else if(context.data.lastmod){
				var lastmod = context.data.lastmod;
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
}).call(this);