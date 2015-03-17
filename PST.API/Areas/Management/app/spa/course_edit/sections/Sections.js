"use strict";

(function () {

    angular.module('pct.management.courseEdit.sections', [
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.sections', {
                    url: '/sections',
                    templateUrl: "/Areas/Management/app/spa/course_edit/sections/Sections.html",
                    controller: "courseEdit.sections.Ctrl"
                })
            ;
        })

        .controller("courseEdit.sections.Ctrl", function ($scope, LayoutService) {
            LayoutService.setBreadCrumbs($scope, {
                sub: "Bayer: MaxForce Impact Roach Gel Bait",
                rootState: "courses"
            });

            $scope.setCel({
                step: 1
            });
        })
    ;

})();