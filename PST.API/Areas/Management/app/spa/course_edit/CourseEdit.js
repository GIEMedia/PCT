"use strict";

(function () {

    angular.module('pct.management.courseEdit', [
        'pct.management.courseEdit.information',
        'pct.management.courseEdit.sections',
    ])
        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit', {
                    url: '/course/:courseId',
                    data: {
                        name: "Courses"
                    },
                    templateUrl: "/Areas/Management/app/spa/course_edit/CourseEdit.html",
                    controller: "courseEdit.Ctrl"
                })
            ;
        })

        .controller("courseEdit.Ctrl", function ($scope, LayoutService) {
            LayoutService.setCustomFooter($scope, {
                templateUrl: "/Areas/Management/app/spa/course_edit/CourseEditFooter.html"
            });

            $scope.steps = [
                {
                    state: "information",
                    title: 'Information'
                },
                {
                    state: "sections",
                    title: 'Sections'
                },
                {
                    title: 'Test'
                },
                {
                    title: 'Review & Invite'
                },
                {
                    title: 'Publish'
                }
            ];
            $scope.cel = {
                step: 0
            };

            $scope.setCel = function(cel) {
                ObjectUtil.clear($scope.cel);
                ObjectUtil.copy(cel, $scope.cel);
            };
        })

    ;

})();