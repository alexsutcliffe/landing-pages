module.exports = function(grunt){
	var $jsFiles = 'js/**/*.js';
	var $SassFiles = 'scss/**/*.scss';
	var $mainSass = 'scss/main.scss';
	// Configure tasks here
	grunt.initConfig({

		jshint: {
	    	options: {
	    		'-W041': true,
	    		'-W044': true,
	    		'-W014': true,
	    		'-W038': true,
	    		'-W099': true
	    	},
			files: [$jsFiles]
		},
 
		uglify: {
			options: {
      			mangle: false
    		}, 
			dist: { 
				files: {	
					'../dist/assets/js/main.js' : ['js/main.js'],
					'../dist/assets/js/thankyou.js' : ['js/thankyou.js'],
					'../dist/assets/js/webinar.js' : ['js/webinar.js'],
					'../dist/assets/js/whitepaper.js' : ['js/whitepaper.js'],
					'../dist/assets/js/mktutils.js' : ['js/mktutil/jquery-cookie.js', 'js/mktutil/mktutil_save.js', 'js/mktutil/mktutil_load.js', 'js/mktutil/mktutil.js']
				}
			} 
		},

		sass: {
			dist: {
				options: {
					style: 'compressed',
					sourcemap: 'none',
					loadPath: [
			          'bower_components/bourbon/app/assets/stylesheets',
			          'bower_components/neat/app/assets/stylesheets'
			        ]
				},
				files: {
					'../dist/assets/css/main.css': $mainSass
				}
			}
		},

		copy: {
		  dist: {
		    files: {
		    	'../dist/assets/js/jquery.validate.min.js' : ['bower_components/jquery-validation/dist/jquery.validate.min.js'],
		    	'../dist/assets/js/additional-methods.min.js' : ['bower_components/jquery-validation/dist/additional-methods.min.js']

		    }
		  }
		},

		watch: {
			grunt: { 
				files: ["gruntfile.js"],  
				tasks: ["default"] 
			},

			script: {
				files: $jsFiles,
				tasks: ['default']
			},

			sass: {
				files: $SassFiles,
				tasks: ["default"]
			}
		}
	});

	// Load tasks here
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Register tasks here
	grunt.registerTask('default', ['jshint', 'uglify', 'sass', 'copy']);
	
}