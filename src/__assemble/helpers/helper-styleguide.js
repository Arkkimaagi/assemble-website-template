/*jshint node:true */
module.exports.register = function(Handlebars, options) {
	var helpers = {};


	/**
	 * Formats styleguide content into rendered and escaped versions with title
	 * @param  {String} title   Title of the codeblock
	 * @param  {String} code    Sample code to be run
	 * @param  {Object} options Internal object
	 * @return {String}         Formatted HTML with rendered and escaped code
	 */
	helpers.styleguide = function(title,code,options) {
		code = code.replace(/^\n*/g,"").replace(/\n*$/g,"");
		var result = "";
		var compiled = Handlebars.compile(code)(this,options);
		var slug = require("slug");
		var titleId = slug(title).toLowerCase();
		var hbs = Handlebars.helpers.codeblock(code,'html');
		var htm = Handlebars.helpers.codeblock(compiled,'html');
		var htm_active = (hbs.toString()===htm.toString())?' active':'';
		
		//result += '<h4 class="styleguide-title">'+title+'</h4>\n';
		result += '<div class="styleguide-container">\n';
		result +=		Handlebars.compile('{{h3 "'+title+'" "styleguide-title"}}')(this,options)+'\n';
		result +=		compiled+'\n';
		result += '	<div class="clearfix"></div>\n';
		result += '	<div class="tabbable tabs-below styleguide-tabcontent">'+'\n';
		result += '		<div class="tab-content styleguide-code">\n';
		if(htm_active===''){
			result += '			<div class="tab-pane active" id="guide-'+titleId+'-hbs">\n';
			result +=					hbs+'\n';
			result += '			</div>\n';
		}
		result += '			<div class="tab-pane'+htm_active+'" id="guide-'+titleId+'-html">\n';
		result +=					htm+'\n';
		result += '			</div>\n';
		result += '		</div>\n';
		result += '		<ul class="nav nav-tabs styleguide-code-toggle">\n';
		if(htm_active===''){
			result += '			<li class="active"><a href="#guide-'+titleId+'-hbs" data-toggle="tab">Handlebars</a></li>\n';
		}
		result += '			<li class="'+htm_active+'"><a href="#guide-'+titleId+'-html" data-toggle="tab">HTML</a></li>\n';
		result += '		</ul>\n';
		result += '	</div>\n';
		result += '</div>\n';
		return new Handlebars.SafeString(result);
	};



	for(var index in helpers){
		Handlebars.registerHelper(index, helpers[index]);
	}
	return this;
};