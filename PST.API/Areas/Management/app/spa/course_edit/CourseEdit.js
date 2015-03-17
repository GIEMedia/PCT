"use strict";

(function () {

    angular.module('pct.management.courseEdit', [
        'pct.management.courseEdit.information',
        'pct.management.courseEdit.sections',
        'pct.management.courseEdit.test',
        'pct.management.courseEdit.reviewInvite',
        'pct.management.courseEdit.publish'
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
            var footerControl = LayoutService.setCustomFooter($scope, {
                templateUrl: "/Areas/Management/app/spa/course_edit/CourseEditFooter.html"
            });
            //footerControl.setClass("footer-secondary");

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
                    state: "test",
                    title: 'Test'
                },
                {
                    state: "reviewInvite",
                    title: 'Review & Invite'
                },
                {
                    state: "publish",
                    title: 'Publish'
                }
            ];
            $scope.cel = {
                step: 0
            };

            $scope.setCel = function(cel) {
                ObjectUtil.clear($scope.cel);
                ObjectUtil.copy(cel, $scope.cel);
                //if (!$scope.$$phase) $scope.$digest();
            };
        })

    ;

})();