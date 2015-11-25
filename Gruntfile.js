

module.exports = function(grunt) {

    grunt.initConfig({
        less: {
            tmp: {
                options: {
                    paths: ["src/style"]
                },
                files: {
                    "tmp/css/styles.css": "src/style/base.less"
                }
            }
        },
        cssmin: {
            tmp: {
                files: {
                    'tmp/css/styles.css': ['tmp/css/styles.css']
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            tmp: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: '**/*.js',
                    dest: 'tmp/js'
                }]
            }
        },
        htmlmin: {
            tmp: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'tmp/index.html': 'src/index.html',
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
            tmp: {
                src: 'tmp/css/*.css'
            }
        },
        copy: {
            bowerTmp: {
                files: [
                    // includes files within path and its sub-directories
                    {expand: false, filter: 'isFile', src: ['bower_components/chico/dist/ui/chico.min.css'], dest: 'tmp/css/chico.min.css'},
                    {expand: false, filter: 'isFile', src: ['bower_components/chico/dist/ui/chico.min.js'], dest: 'tmp/js/chico.min.js'},
                    {expand: false, filter: 'isFile', src: ['bower_components/jquery/dist/jquery.min.js'], dest: 'tmp/js/jquery.min.js'},
                    {expand: false, filter: 'isFile', src: ['bower_components/tiny.js/dist/tiny.min.js'], dest: 'tmp/js/tiny.min.js'},
                    {expand: true, filter: 'isFile', flatten: true, src: ['bower_components/chico/dist/assets/*'], dest: 'tmp/assets/'}
                ],
            },
            srcToTmp: {
                files: [
                    {expand: true, filter: 'isFile', flatten: true, src: ['src/images/*'], dest: 'tmp/images/'},
                ]
            },
            tmpToTarget: {
                files: [
                    {expand: true, filter: 'isFile', flatten: true, src: ['tmp/css/*'], dest: 'target/css/'},
                    {expand: true, filter: 'isFile', flatten: true, src: ['tmp/js/*'], dest: 'target/js/'},
                    {expand: true, filter: 'isFile', flatten: true, src: ['tmp/images/*'], dest: 'target/images/'},
                    {expand: true, filter: 'isFile', flatten: true, src: ['tmp/*'], dest: 'target/'},
                    {expand: true, filter: 'isFile', flatten: true, src: ['tmp/assets/*'], dest: 'target/assets/'},
                ]
            }
        },
        clean: {
            tmp: {
                src: ["tmp/**/*", "!tpm/.gitignore"]
            },
            tmpNoTest: {
                src: ["tmp/css/*", "tmp/js/*", "!tmp/css/test.css", "!tmp/js/test.js", "!tmp/index.html","!tmp/.gitignore"]
            },
            target: {
                src: ["target/**/*", "!target/.gitignore"]
            }
        },
        concat: {
            options: {
                banner: '/** Test.js ***/\n',
                process: function(src, filepath) {
                    return '\n/**' + filepath.split('/').pop() + '**/\n' + src;
                }
            },
            tmp: {
                files: {
                    'tmp/css/test.css': ['tmp/css/*.css'],
                    'tmp/js/test.js': ['tmp/js/jquery.min.js', 'tmp/js/tiny.min.js', 'tmp/js/chico.min.js', 'tmp/js/main.js'],
                },
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask('generate_tmp', ['clean:tmp', 'less:tmp', 'cssmin:tmp', 'postcss:tmp', 'uglify:tmp', 'copy:bowerTmp', 'copy:srcToTmp', 'htmlmin:tmp', 'concat:tmp']);
    grunt.registerTask('tmp_to_target', ['clean:target', 'clean:tmpNoTest', 'copy:tmpToTarget', 'clean:tmp']);
    grunt.registerTask('build', ['generate_tmp', 'tmp_to_target']);
    grunt.registerTask('dev', ['build', 'watch'])

};
