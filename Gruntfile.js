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
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-livereload');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-regarde');
	grunt.loadNpmTasks('grunt-regex-replace');


//--------------------------------------------------------------------------------------------------

	var conf = {

		// Is this really needed?
		pkg: grunt.file.readJSON('package.json'),
		is_live: false,

		//Assemble files from .hbs -contentfiles, based on data, layouts and partials
		assemble:{
			_watch:[
				'src/__assemble/data/**/*.{json,yml}',
				'src/__assemble/helpers/*.js',
				'!src/_{script,style}/**/*',
				'src/**/*.hbs'
			],
			options:{
				assets:'build/',
				data:['src/__assemble/data/**/*.{json,yml}'],
				ext:'',
				helpers:'src/__assemble/helpers/*.js',
				layout:'default.hbs',
				layoutdir:'src/__assemble/layouts/',
				partials:['src/__assemble/partials/**/*.hbs'],
				removeHbsWhitespace: true,
				collections:['pagetype'],

				//Custom options
				//fs: require('fs'),
				about: {
					version: '0.4.0'
				},
				pkg: grunt.file.readJSON('package.json'),
				bundles:'<%= uglify %>',
				urlroot:'build/index.html',
				livereloadport:'<%= livereload.port %>',
				dev:true,
				is_live:'<%= is_live %>'
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
					dumpLineNumbers: false //'all'
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
				script: '<%=jshint.script.files.src%>',
				hbshelpers: '<%=jshint.hbshelpers.files.src%>',
				gruntfile: '<%=jshint.gruntfile.files.src%>'
			},
			options: {
				jshintrc: '.jshintrc'
				//TODO: change 'trailing':true in .jshintrc when sublimelinter has been updated so that it does not complain
				//about empty rows with whitespace.
			},
			script: {
				files: {src:['src/_script/*.js','src/_script/site/**/*.js']}
			},
			hbshelpers: {
				files: {src:['src/__assemble/helpers/*.js']}
			},
			gruntfile: {
				files: {src:['Gruntfile.js']}
			}
		},

		//This is not run by default anymore. Instead uglify minimizes the files and generates sourcemaps for them.
		//concat can still be called for debugging purposes, altho I do not see a real need for it.
		concat: {
			global: {
				src: [
					'src/_script/lib/jquery/jquery-1.9.1.js',
					'src/_script/lib/bootstrap_v2.3.2/bootstrap-transition.js',
					'src/_script/lib/bootstrap_v2.3.2/bootstrap-alert.js',
					'src/_script/lib/bootstrap_v2.3.2/bootstrap-modal.js',
					'src/_script/lib/bootstrap_v2.3.2/bootstrap-dropdown.js',
					'src/_script/lib/bootstrap_v2.3.2/bootstrap-scrollspy.js',
					'src/_script/lib/bootstrap_v2.3.2/bootstrap-tab.js',
					'src/_script/lib/bootstrap_v2.3.2/bootstrap-tooltip.js',
					'src/_script/lib/bootstrap_v2.3.2/bootstrap-popover.js',
					'src/_script/lib/bootstrap_v2.3.2/bootstrap-button.js',
					'src/_script/lib/bootstrap_v2.3.2/bootstrap-collapse.js',
					'src/_script/lib/bootstrap_v2.3.2/bootstrap-carousel.js',
					'src/_script/lib/bootstrap_v2.3.2/bootstrap-typeahead.js'
				],
				dest: 'build/_script/_bundles/global.js'
			}
		},

		//Minimize javascript with sourcemap support
		uglify: {
			options: {
				mangle: false
			},
			global: {
				options: {
					sourceMap: '<%= uglify.global.dest %>.map'
				},
				src: '<%= concat.global.src %>',
				dest: '<%= concat.global.dest.replace(".js",".min.js") %>'
			}
		},
		
		//Fix the sourcemap support code (uglify generates wrong paths.)
		'regex-replace': {
			uglify_fix_map: {
				src: ['<%= uglify.global.options.sourceMap %>'],
				actions: [
					{
						name: 'target path',
						search: '"build\/_script\/_bundles\/',
						replace: '"',
						flags: 'g'
					},
					{
						name: 'source path',
						search: '"src\/_script\/',
						replace: '"../',
						flags: 'g'
					}
				]
			},
			uglify_fix_min: {
				src: ['<%= uglify.global.dest %>'],
				actions: [
					{
						name: 'map path',
						search: 'sourceMappingURL=build\/_script\/_bundles\/',
						replace: 'sourceMappingURL=',
						flags: 'g'
					}
				]
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
				src: ['<%= imagemin._clean %>']
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
				tasks: ['set_live','assemble'],
				spawn: true
				//Assemble should not spawn when it supports regarde
			},
			
			less: {
				files: '<%= less._watch %>',
				tasks: ['set_live','less'],
				spawn: true
			},
			
			jshint_script: {
				files: '<%= jshint._watch.script %>',
				tasks: ['set_live','jshint:script'],
				spawn: true
			},
			
			jshint_hbshelpers: {
				files: '<%= jshint._watch.hbshelpers %>',
				tasks: ['set_live','jshint:hbshelpers'],
				spawn: true
			},
			
			jshint_gruntfile: {
				files: '<%= jshint._watch.gruntfile %>',
				tasks: ['set_live','jshint:gruntfile'],
				spawn: true
			},
			
			//Bundle watching is generated automatically
			
			copy_style:{
				files: '<%= copy._watch.style %>',
				tasks: ['set_live','copy:style'],
				spawn: true
			},
			
			htaccess:{
				files: '<%= copy._watch.htaccess %>',
				tasks: ['set_live','copy:htaccess'],
				spawn: true
			},
			
			copy_script:{
				files: '<%= copy._watch.script %>',
				tasks: ['set_live','copy:script'],
				spawn: true
			},
			
			copy_script_site:{
				files: '<%= copy._watch.script_site %>',
				tasks: ['set_live','copy:script_site'],
				spawn: true
			},
			
			imagemin: {
				files: '<%= imagemin._watch %>',
				tasks: ['set_live','imagemin'],
				spawn: true
			},
			
			live: {
				//Limiting this to few levels is more efficient than running it on whole path.
				//Seriously, it takes loads of cpu time with /**/* setting.
				files: ['build/*','build/*/*','build/*/*/*'],
				tasks: ['set_live','livereload']
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
		}
		//,
		////A quick tool for testing the file matching patterns.
		////Useful only for Gruntfile.js debugging
		//filematch: {
		//	less: '<%= regarde.assemble.files %>'
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
		conf.regarde['concat-'+key] = {
			files:val.src,
			tasks: ['concat:'+key],
			spawn:true
		};
	});
	_.each(conf.uglify,function(val,key,content){
		if(key!=='options'){
			conf.regarde['uglify-'+key] = {
				files:val.src,
				tasks: ['uglify:'+key],
				spawn:true
			};
		}
	});

//--------------------------------------------------------------------------------------------------

	// Project configuration.
	grunt.initConfig(conf);

	//grunt.renameTask('regarde', 'watch');

	grunt.registerTask('set_live', 'Sets a global flag telling that we\'re in live mode.', function() {
		grunt.config.set('is_live', true);
	});

	grunt.registerTask('validate', [
		'jshint'
	]);

	grunt.registerTask('images', [
		'clean:imagemin',
		'imagemin'
	]);

	grunt.registerTask('bundle', [
		//'concat',
		'uglify',
		'regex-replace'
	]);

	grunt.registerTask('build', [
		'assemble',
		'less',
		'copy',
		'bundle',
		'images'
	]);

	grunt.registerTask('live', [
		'livereload-start',
		'connect',
		'regarde'
	]);

	grunt.registerTask('default', [
		'validate',
		'build'
	]);

	grunt.registerTask('watch',[
		'set_live',
		'default',
		'live'
	]);

	grunt.registerTask('rebuild', [
		'clean:build',
		'default'
	]);

};
