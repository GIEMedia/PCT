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

        .controller("courseEdit.Ctrl", function ($scope, $state, $q, $stateParams, LayoutService, CourseService) {
            var footerControl = LayoutService.setCustomFooter($scope, {
                templateUrl: "/Areas/Management/app/spa/course_edit/CourseEditFooter.html"
            });

            $scope.$watch("course", function(course) {
                if (course) {
                    LayoutService.setBreadCrumbs($scope, {
                        sub: course.id == null ? "New" : course.title,
                        rootState: "courses"
                    });
                }
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

            $scope.$watch("{2: 'footer-secondary', 1: 'footer-finished'}[course.status]", function(styleClass) {
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

            $scope.ce = {
                saving: false
            };
            $scope.cel = {
                step: 0,
                save: null,
                needSaving: null
            };

            $scope.setCel = function(cel) {
                ObjectUtil.clear($scope.cel);
                ObjectUtil.copy(cel, $scope.cel);
            };

            $scope.needSaving = function() {
                return $scope.cel.save && $scope.cel.needSaving != null && $scope.cel.needSaving();
            };

            $scope.saveCourse = function(then) {
                var defer = $q.defer();
                $scope.ce.saving = true;
                $scope.cel.save().then(function() {
                    $scope.ce.saving = false;
                    defer.resolve();
                });
                return defer.promise;
            };

            function nav(go) {
                if (!$scope.needSaving()) {
                    go();
                } else {
                    $scope.saveCourse().then(go);
                }
            }

            $scope.prevPage = function() {
                nav(function() {
                    $state.go('courseEdit.' + $scope.steps[$scope.cel.step - 1].state, {courseId: $scope.course.id});
                });
            };
            $scope.nextPage = function() {
                nav(function() {
                    $state.go('courseEdit.' + $scope.steps[$scope.cel.step + 1].state, {courseId: $scope.course.id});
                });
            };
            $scope.toPage = function(page) {
                nav(function() {
                    $state.go('courseEdit.' + $scope.steps[page].state, {courseId: $scope.course.id});
                });
            };
        })

    ;

})();