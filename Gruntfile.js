/*global module:false*/
/*jshint node:true */
'use strict';

//Livereload
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
	return connect['static'](require('path').resolve(dir));
};

module.exports = function(grunt) {

	//Increase max listneres for grunt-regarde
	grunt.event.setMaxListeners(50);

	// LoDash library for Array handling
	var _ = grunt.util._;

	// Load all grunt tasks
	//require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-livereload");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-regarde");


//--------------------------------------------------------------------------------------------------

	var conf = {

		// Is this really needed?
		pkg: grunt.file.readJSON('package.json'),

		//Assemble files from .hbs -contentfiles, based on data, layouts and partials
		assemble:{
			_watch:[
				'src/__assemble/data/**/*.{json,yml}',
				'src/__assemble/helpers/*.js',
				'!src/_{script,style}/**/*',
				'src/**/*.hbs'
			],
			options:{
				ext:'',
				data:['src/__assemble/data/**/*.{json,yml}'],
				layout:'src/__assemble/layouts/default.hbs',
				//layout:'default.hbs',
				//layoutdir:'src/__assemble/layouts/',
				partials:['src/__assemble/partials/**/*.hbs'],
				//TODO: The helpers structure is in a flux, so lets solve this mess when assemble is fixed
				helpers:'src/__assemble/helpers/help.js',
				//registerFunctions: function(engine) {
				//	var helperFunctions = require('./src/__assemble/helpers/helpers.js');
				//	engine.engine.registerFunctions(helperFunctions);
				//},
				assets:'build/',
				removeHbsWhitespace: true,

				pkg: grunt.file.readJSON('package.json'),
				bundles:'<%= concat %>',
				bundles_open:false,
				siteroot:'build/',
				livereloadport:'<%= livereload.port %>',

				dev:true
			},
			hbs:{
				files:[
					{
						expand:true,
						cwd:'src/',
						src:['**/*.hbs','!_{_assemble,script,style}/**/*'],
						dest:'build/'
					}
				]
			}
		},


		//Convert root less files to css files (do not look under subpaths)
		less: {
			_watch:'src/_style/less/**/*.{less,css}',
			css: {
				options: {
					yuicompress: false,
					dumpLineNumbers: false //"all"
				},
				files: [
					{
						expand: true,
						cwd: 'src/_style/less/',
						src: ['*.less'],
						dest: 'build/_style/css/',
						ext: '.css'
					}
				]
			}
		},

		//Check syntax of JavaScript
		jshint: {
			_watch: {
				script: '<%=jshint.script.files.src%>'
			},
			options: {
				/* JsHint settings, remember to put this to your editor too */
				"bitwise":true,
				"camelcase":false,
				"curly":true,
				"eqeqeq": true,
				"forin":false,
				"immed": false,
				"latedef": true,
				"newcap": true,
				"noarg": true,
				"noempty": false,
				"nonew": true,
				"plusplus":false,
				"regexp": true,
				"strict":false,
				"trailing": true,
				"undef": true,
				"unused": false,
				"white":false,
				/**/
				"es5":true,
				"sub":true,
				/**/
				"browser": true,
				"jquery": true
			},
			script: {
				files: {src:['src/_script/*.js','src/_script/site/**/*.js']}
			}
		},

		//TODO: Maybe this should be done with uglify-js when the bugs are ironed out from it.
		concat: {
			global: {
				src: [
					'src/_script/lib/jquery/jquery-1.9.1.js',
					'src/_script/lib/bootstrap/bootstrap-transition.js',
					'src/_script/lib/bootstrap/bootstrap-alert.js',
					'src/_script/lib/bootstrap/bootstrap-modal.js',
					'src/_script/lib/bootstrap/bootstrap-dropdown.js',
					'src/_script/lib/bootstrap/bootstrap-scrollspy.js',
					'src/_script/lib/bootstrap/bootstrap-tab.js',
					'src/_script/lib/bootstrap/bootstrap-tooltip.js',
					'src/_script/lib/bootstrap/bootstrap-popover.js',
					'src/_script/lib/bootstrap/bootstrap-button.js',
					'src/_script/lib/bootstrap/bootstrap-collapse.js',
					'src/_script/lib/bootstrap/bootstrap-carousel.js',
					'src/_script/lib/bootstrap/bootstrap-typeahead.js'
				],
				dest: 'build/_script/_bundles/global.js'
			}
		},

		//Copy files to the build folder
		copy: {
			_watch:{
				style:['src/_style/font/*','src/favicon.ico'],
				htaccess:['src/.htaccess'],
				script:['src/_script/*.js'],
				script_site:['src/_script/site/**']
			},
			style: { //Copy fonts and .ico files
				files: [
					{
						expand: true,
						src: ['_style/font/*','favicon.ico'],
						cwd: 'src/',
						dest: 'build/'
					}
				]
			},
			htaccess: { //Copy site settings
				files: [
					{
						expand: true,
						src: ['.htaccess'],
						cwd: 'src/',
						dest: 'build/'
					}
				]
			},
			script: { //Copy root js
				files: [
					{
						expand: true,
						cwd: 'src/_script/',
						src: ['*.js'],
						dest: 'build/_script/'
					}
				]
			},
			script_lib: { //Copy all the javascript libs
				files: [
					{
						expand: true,
						cwd: 'src/_script/lib/',
						src: ['**'],
						dest: 'build/_script/lib/'
					}
				]
			},
			script_site: { //Copy all the javascript site stuff
				files: [
					{
						expand: true,
						cwd: 'src/_script/site/',
						src: ['**'],
						dest: 'build/_script/site/'
					}
				]
			}
		},


		// Minimize png and jpg files
		imagemin: {
			_watch:'src/**/*.{png,jpg}',
			_clean:'build/**/*.{png,jpg}',
			all: {
				options: {
					optimizationLevel: 1
				},
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['**/*.{png,jpg}'],
						dest: 'build/'
					}
				]
			},
			style: {
				options: {
					optimizationLevel: 1
				},
				files: [
					{
						expand: true,
						cwd: 'src/style/less/',
						src: ['**/*.{png,jpg}'],
						dest: 'build/style/css/'
					}
				]
			}
		},

		// GZIP or ZIP the site
		compress: {
			gzip: {
				options: {
					mode: 'gzip'
				},
				expand: true,
				cwd: 'build/',
				src: ['**/*.{html,js,css,txt,xml,eot,svg,ttf,woff,otf}'],
				dest: 'build/'
			}
		},


		//Clean the structure, so that everything can be generated from scratch
		clean: {
			build: {
				files:[
					{
						src: ['build/*']
					}
				]
			},
			imagemin:{
				src: ["<%= imagemin._clean %>"]
			},
			gzip:{
				files:[
					{
						src: ['build/**/*.gz']
					}
				]
			}
		},


		//Watch for changes and act upon them
		regarde: {
			assemble: {
				files: '<%= assemble._watch %>',
				tasks: ['assemble'],
				spawn: true
				//Assemble should not spawn when it supports regarde
			},
			
			less: {
				files: '<%= less._watch %>',
				tasks: ['less'],
				spawn: true
			},
			
			jshint: {
				files: '<%= jshint._watch.script %>',
				tasks: ['jshint:script'],
				spawn: true
			},
			
			//Bundle watching is generated automatically
			
			copy_style:{
				files: '<%= copy._watch.style %>',
				tasks: ['copy:style'],
				spawn: true
			},
			
			htaccess:{
				files: '<%= copy._watch.htaccess %>',
				tasks: ['copy:htaccess'],
				spawn: true
			},
			
			copy_script:{
				files: '<%= copy._watch.script %>',
				tasks: ['copy:script'],
				spawn: true
			},
			
			copy_script_site:{
				files: '<%= copy._watch.script_site %>',
				tasks: ['copy:script_site'],
				spawn: true
			},
			
			imagemin: {
				files: '<%= imagemin._watch %>',
				tasks: ['imagemin'],
				spawn: true
			},
			
			live: {
				//Limiting this to few levels is more efficient than running it on whole path.
				//Seriously, it takes loads of cpu time with /**/* setting.
				files: ['build/*','build/*/*','build/*/*/*'],
				tasks: ['livereload']
				//Live should not spawn (to work at all)
			}
		},

		//Configure livereload server
		//port: 35729 would be the default, but it bugs with livereload app
		livereload: {
			port: 35730
		},

		//Configure livereload connect server
		//This could be used for previewing site content at localhost:9001
		connect: {
			livereload: {
				options: {
					port: 9001,
					middleware: function(connect, options) {
						return [lrSnippet, mountFolder(connect, 'build')];
					}
				}
			}
		},

		////A quick tool for testing the file matching patterns.
		////Useful only for Gruntfile.js debugging
		//filematch: {
		//	less: '<%= watch.hogan.files %>'
		//}

		////Generate a styleguide based on LESS/CSS code
		//styleguide: {
		//	styledocco: {
		//		options: {
		//			framework: {
		//				name: 'styledocco'
		//			},
		//			name: 'JD Style Guide',
		//			template: {
		//				//include: ['plugin.css', 'app.js']
		//			}
		//		},
		//		files: {
		//			'build/_dev/styleguide': ['src/style/less/**/*.{less,css}']
		//		}
		//	}
		//},

		//// Compress site for easy downloading
		//compress: {
		//	build: {
		//		options: {
		//			archive: 'build/_dev/download/build.zip'
		//		},
		//		files: [
		//			{expand: true, cwd: ['build/'], src: ['build/**','!build/_dev/download/**'], dest: '<%= pkg.name %>_<%= pkg.version %>_build'}
		//		]
		//	},
		//	src: {
		//		options: {
		//			archive: 'build/_dev/download/src.zip'
		//		},
		//		files: [
		//			{src: ['*.{js,json,md,sublime-project}','tasks/**','src/**','doc/**'], dest: '<%= pkg.name %>_<%= pkg.version %>_src'}
		//		]
		//	}
		//},


	};

//--------------------------------------------------------------------------------------------------

	//Automatically add bundles to watch list
	_.each(conf.concat,function(val,key,content){
		conf.regarde["concat-"+key] = {
			files:val.src,
			tasks: ['concat:'+key],
			spawn:true
		};
	});

//--------------------------------------------------------------------------------------------------

	// Project configuration.
	grunt.initConfig(conf);

	//grunt.renameTask('regarde', 'watch');

	grunt.registerTask('validate', [
		'jshint:script'
	]);

	grunt.registerTask('images', [
		'clean:imagemin', 'imagemin'
	]);

	grunt.registerTask('build', [
		'assemble', 'less', 'copy', 'concat', 'images'
	]);

	grunt.registerTask('live', [
		'livereload-start',
		'connect',
		'regarde'
	]);

	grunt.registerTask('default', [
		'validate', 'build'
	]);

	grunt.registerTask('watch',[
		'default',
		'live'
	]);

	grunt.registerTask('rebuild', [
		'clean:build', 'default'
	]);

};
