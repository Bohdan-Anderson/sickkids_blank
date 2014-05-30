module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			js: {
				src: [
					'application/src/js/libraries/*.js',
					'application/src/js/libraries/**/*.js'
				],
				dest: 'application/static/js/all-lib.js'
			},
			myjs: {
				src: [
					'application/src/js/*.js'
				],
				dest: 'application/static/js/custom.js'
			},
			css: {
				src: [
					'application/src/sass/reset.scss',
					'application/src/sass/base.scss',
					'application/src/sass/screen.scss'
					// 'application/src/scss/print.scss'
				],
				dest: 'application/src/css/screen.scss'
			}
		},
		autoprefixer: {
			options: {
				browsers: ['ie 8', 'ie 9', 'opera 12', 'ff 15', 'chrome 25']
			},
			multiple_files: {
				expand: true,
				flatten: true,
				src: 'application/src/css/*.css',
				dest: 'application/static/css/'
			},
		},
		uglify: {
			build: {
				src: 'application/static/js/all-lib.js',
				dest: 'application/static/js/all-lib.min.js'
			},
			myjs: {
				src: 'application/static/js/custom.js',
				dest: 'application/static/js/custom.min.js'
			}
		},
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'application/src/assets/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'application/static/assets/'
				}]
			}
		},
		sass: {
			dist: {
				options: {
					style: 'compressed',
				},
				files: {
					'application/src/css/screen.css': 'application/src/css/screen.scss',
				}
			}
		},
		watch: {
			scripts: {
				files: ['application/src/js/libraries/*.js'],
				tasks: ['concat:js', 'uglify', 'notify:js'],
				options: {
					spawn: false
				}
			},
			myjs: {
				files: ['application/src/js/*.js'],
				// tasks: ['concat:myjs', 'uglify:myjs', 'notify:js'],
				tasks: ['concat:myjs', 'notify:js'],
				options: {
					spawn: false
				}
			},
			css: {
				files: ['application/src/sass/*.scss'],
				tasks: ['concat:css', 'sass', 'autoprefixer', 'notify:css'],
				options: {
					spawn: false,
				}
			}
		},

		notify: {
			css: {
				options: {
					message: "SASS compressed"
				}
			},
			js: {
				options: {
					message: "JS compressed"
				}
			},
			started: {
				options: {
					message: "Started watching"
				}
			}
		}
	});




	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-autoprefixer');

	grunt.registerTask('w', ['watch', 'notify:started'])
	grunt.registerTask('i', ['imagemin'])
	grunt.registerTask('default', ['concat', 'uglify', 'imagemin']);
	grunt.registerTask('scss', ['concat:css', 'sass']);
};