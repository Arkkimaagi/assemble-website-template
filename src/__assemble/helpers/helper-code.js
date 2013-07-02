/*jshint node:true */

module.exports.register = function(Handlebars, options) {
	var helpers = {};

	/**
	 * Inline code
	 * @param  {String} codesample Code to be escaped and formatted
	 * @return {String}            Formatted html code with codesample
	 */
	helpers.code = function(codesample) {
		var ent = require('ent');
		return new Handlebars.SafeString("<code>"+ent.encode(codesample)+"</code>");
	};

	/**
	 * Prettify codeblock contents
	 * @param  {String} codesample Code to be prettified
	 * @param  {String} lang       Language of the code (optional)
	 * @return {String}            Prettified codeblock html code
	 */
	helpers.codeblock = function(codesample,lang) {
		//console.log('sss',codesample, codesample.replace);
		if(codesample && !codesample.replace && codesample.string){
			codesample = codesample.string;
		}
		codesample = codesample.replace(/^\n*/g,"").replace(/\n*$/g,"");
		var ent = require('ent');
		if(typeof lang === "string"){
			lang = ' class="language-'+lang+'"';
		}else{
			lang = '';
		}
		var result = '';
		result += '<pre class="prettyprint linenums"><code'+lang+'>';
		result += ent.encode(codesample);
		result += '</code></pre>';
		return new Handlebars.SafeString(result);
	};


	for(var index in helpers){
		Handlebars.registerHelper(index, helpers[index]);
	}
	return this;
};
