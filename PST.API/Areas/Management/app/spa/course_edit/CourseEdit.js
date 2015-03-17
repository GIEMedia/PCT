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

        .controller("courseEdit.Ctrl", function ($scope, $state, $stateParams, LayoutService, CourseService) {
            var footerControl = LayoutService.setCustomFooter($scope, {
                templateUrl: "/Areas/Management/app/spa/course_edit/CourseEditFooter.html"
            });

            if ($stateParams.courseId == "new") {
                $scope.course = {
                    state_ceus: [],
                    status: 0
                };
            } else {
                CourseService.get($stateParams.courseId).success(function(course) {
                    $scope.course = course;
                });
            }

            $scope.$watch("{2: 'footer-secondary'}[course.status]", function(styleClass) {
                footerControl.setClass(styleClass);
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
                step: 0,
                save: null,
                needSaving: null
            };

            $scope.setCel = function(cel) {
                ObjectUtil.clear($scope.cel);
                ObjectUtil.copy(cel, $scope.cel);
            };

            $scope.nextPage = function() {
                var go = function() {
                    $state.go('courseEdit.' + $scope.steps[$scope.cel.step + 1].state, {courseId: $scope.course.id});
                };
                if ($scope.cel.needSaving == null || !$scope.cel.needSaving()) {
                    go();
                } else {
                    $scope.cel.save().then(go);
                }
            };
        })

    ;

})();