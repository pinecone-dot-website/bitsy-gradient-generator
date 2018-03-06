"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            dist: {
                files: [{
                    cwd: 'es6',
                    dest: 'js',
                    expand: true,
                    ext: '.js',
                    src: ['app.js']
                }],
                options: {
                    browserifyOptions: {
                        debug: true,
                        paths: []
                    },
                    transform: [
                        [
                            "babelify", {
                                "presets": ["env"]
                            }
                        ]
                    ]
                }
            }
        },

        sass: {
            options: {
                includePaths: [

                ]
            },
            dist: {
                options: {
                    outputStyle: 'compact'
                },
                files: [{
                    cwd: 'scss',
                    dest: 'css',
                    expand: true,
                    ext: '.css',
                    src: ['app.scss']
                }],
            }
        },

        watch: {
            css: {
                files: ['scss/**/*.scss'],
                tasks: ['sass']
            },
            scripts: {
                files: ['es6/**/*.js'],
                tasks: ['browserify']
            },
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    
    grunt.registerTask('default', [
        'browserify', 'sass'
    ]);
};