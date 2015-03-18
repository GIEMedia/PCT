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

        .controller("courseEdit.sections.Ctrl", function ($scope, SectionService) {
            $scope.setCel({
                step: 1
            });

            $scope.$watch("course", function(course) {
                if (course) {
                    SectionService.getList(course.id).success(function(sections) {
                        $scope.sections = sections;
                    });
                }
            });
        })
    ;

})();