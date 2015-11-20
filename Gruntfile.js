

module.exports = function(grunt) {

    grunt.initConfig({
        less: {
            dev: {
                options: {
                    paths: ["src/style"]
                },
                files: {
                    "target/css/styles.css": "src/style/base.less"
                }
            }
        },
        cssmin: {
            src: {
                files: {
                    'target/css/styles.min.css': ['target/css/*.css', '!target/css/*.min.css']
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            src: {
                files: {
                    'target/js/test.min.js': [
                        'src/js/main.js',
                        'bower_components/chico/dist/ui/chico.js',
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/tiny.js/dist/tiny.js'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'target/index.html': 'src/index.html',     // 'destination': 'source'
                }
            },
        },
        watch: {
            options: {
                livereload: true,
            },
            css: {
                files: ['src/style/*.less', 'src/js/*.js', 'src/index.html'],
                tasks: ['build'],
            },
        },
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
                ]
            },
            dist: {
                src: 'target/css/*.css'
            }
        },
        copy: {
            bower: {
                files: [
                    // includes files within path and its sub-directories
                    {expand: false, filter: 'isFile', src: ['bower_components/chico/dist/ui/chico.css'], dest: 'target/css/chico.css'},
                ],
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['less', 'copy', 'cssmin', 'uglify', 'htmlmin', 'postcss', 'watch']);
    grunt.registerTask('build', ['less', 'cssmin', 'uglify', 'htmlmin', 'postcss']);

};
