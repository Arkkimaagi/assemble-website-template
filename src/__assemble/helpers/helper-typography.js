/*jshint node:true */

module.exports.register = function(Handlebars, options) {
	var helpers = {};

	function heading(level, title, className, name, that){
		if(!title){
			return new Handlebars.SafeString('<h'+level+'>'+'</h'+level+'>');
		}
		if(typeof className === "string" && className !== ""){
			className = ' class="'+className+'"';
		}else{
			className = '';
		}
		if(typeof name !== "string"){
			var slug = require("slug");
			name = slug(title).toLowerCase();
		}
		
		var html = '';
		html +=	'<h'+level+className+'>';
		if(that.automatic_anchors_in_headings || that.site && that.site.automatic_anchors_in_headings){
			html +=		'<a name="'+name+'" href="#'+name+'" class="anchor">';
			html +=			'<i class="icon-link"></i>';
			html +=		'</a>';
		}
		html +=		title;
		html +=	'</h'+level+'>';
		return new Handlebars.SafeString(html);
	}

	helpers.h1 = function(title, className, name){
		return heading(1,title,className,name,this);
	};

	helpers.h2 = function(title, className, name){
		return heading(2,title,className,name,this);
	};

	helpers.h3 = function(title, className, name){
		return heading(3,title,className,name,this);
	};

	helpers.h4 = function(title, className, name){
		return heading(4,title,className,name,this);
	};

	helpers.h5 = function(title, className, name){
		return heading(5,title,className,name,this);
	};

	helpers.h6 = function(title, className, name){
		return heading(6,title,className,name,this);
	};

	for(var index in helpers){
		Handlebars.registerHelper(index, helpers[index]);
	}
	return this;
};
