"use strict";

(function () {

    angular.module('pct.management.courses', [
    ])
        .config(function ($stateProvider) {

            $stateProvider
                .state('courses', {
                    url: '/courses',
                    templateUrl: "/Areas/Management/app/spa/courses/Courses.html",
                    controller: "courses.Ctrl"
                })
            ;
        })

        .controller("courses.Ctrl", function ($scope) {

        })
    ;

})();