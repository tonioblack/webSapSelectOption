/*globals module */
module.exports = function (grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.initConfig({
        copy: {
            timeScheduler: {
                files: [
                    {expand: true, cwd: 'dev/TimeLineScheduler/js/', src: ['timelineScheduler.js'], dest: 'dev/libs/'},
                    {expand: true, cwd: 'dev/TimeLineScheduler/css/', src: ['**'], dest: 'dev/css/'}
                ]
            }
        }
    });

    grunt.registerTask('default', ['sass', 'copy:timeScheduler']);
}