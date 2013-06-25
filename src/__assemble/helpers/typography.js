/*jshint node:true */
(function() {
	module.exports.register = function(Handlebars, options) {
		var helpers = {};

		function heading(level, title, name){
			if(!title){
				//console.log("empty");
				return new Handlebars.SafeString('<h'+level+'>'+'</h'+level+'>');
			}
			if(typeof name !== "string"){
				var slug = require("slug");
				name = slug(title).toLowerCase();
			}
			var html = ''+
				'<h'+level+'>'+
					'<a name="'+name+'" href="#'+name+'" class="anchor">'+
						'<i class="icon-link"></i>'+
					'</a>'+
					title+
				'</h'+level+'>';
			//console.log("html",html);
			return new Handlebars.SafeString(html);
		}

		helpers.h1 = function(title, name){
			//console.log("h1",title,name,heading(1,title,name));
			return heading(1,title,name);
		};

		helpers.h2 = function(title, name){
			return heading(2,title,name);
		};

		helpers.h3 = function(title, name){
			return heading(3,title,name);
		};

		helpers.h4 = function(title, name){
			return heading(4,title,name);
		};

		helpers.h5 = function(title, name){
			return heading(5,title,name);
		};

		helpers.h6 = function(title, name){
			return heading(6,title,name);
		};

		for(var index in helpers){
			Handlebars.registerHelper(index, helpers[index]);
		}
		return this;
	};
}).call(this);