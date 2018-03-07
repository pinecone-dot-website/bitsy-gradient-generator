"use strict";

let sprintf = require('sprintf-js').sprintf;

module.exports = function (grunt) {
    let date = (() => {
        let now = new Date();
        return sprintf('%04d-%02d-%02d-%02d%02d', now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes());
    })();

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
        },

        zip: {
            dist: {
                dest: `all-${date}.zip`,
                src: [
                    'index.html',
                    'css/**',
                    'js/**'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-zip');

    grunt.registerTask('default', [
        'browserify', 'sass'
    ]);
};