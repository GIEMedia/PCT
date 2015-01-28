"use strict";

(function () {

    angular.module('pct.elearning.course', [
        'ui.router'
    ])

        .config(function ($stateProvider) {

            $stateProvider
                .state('course', {
                    url: '/course',
                    templateUrl: "/app/course/Course.html",
                    controller: "course.Ctrl"
                })
            ;
        })

        .controller("course.Ctrl", function ($scope) {
        })

    ;

})();