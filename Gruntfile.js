module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                files: {
                    '<%= pkg.main %>': ['src/**/*.js']
                },
                options: {
                    bundleOptions: {
                        debug: true
                    },
                    external: ['gsap']
                }
            }
        },
        browserifyBower: {
            server: {
                options: {
                    file: 'webroot/scripts/vendor.js',
                    forceResolve: {
                        'gsap': 'src/minified/TweenMax.min.js'
                    }
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'webroot/styles/styles.css': 'scss/styles.scss'
                }
            }
        },
        watch: {
            scss: {
                files: 'scss/*.scss',
                tasks: ['sass']
            },
            js: {
                files: 'src/**/*.js',
                tasks: ['browserify']
            }
        },
        autoprefixer: {
            options: {
                // Task-specific options go here.
            },
            dist: {
                options: {

                },
                src: 'webroot/styles/styles.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-browserify-bower');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['browserify', 'sass', 'autoprefixer', 'watch']);
};