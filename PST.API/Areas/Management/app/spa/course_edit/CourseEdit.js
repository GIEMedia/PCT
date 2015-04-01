"use strict";

(function () {

    angular.module('pct.management.courseEdit', [
        'pct.management.courseEdit.information',
        'pct.management.courseEdit.sections',
        'pct.management.courseEdit.test',
        'pct.management.courseEdit.reviewInvite',
        'pct.management.courseEdit.publish'
    ])
        .config(["$stateProvider", function ($stateProvider) {
            $stateProvider
                .state('courseEdit', {
                    url: '/course/:courseId',
                    data: {
                        name: "Courses"
                    },
                    abstract: true,
                    templateUrl: "Areas/Management/app/spa/course_edit/CourseEdit.html",
                    controller: "courseEdit.Ctrl"
                })
            ;
        }])

        .controller("courseEdit.Ctrl", ["$scope", "$state", "$q", "$stateParams", "LayoutService", "CourseService", "WindowService", function ($scope, $state, $q, $stateParams, LayoutService, CourseService, WindowService) {
            var footerControl = LayoutService.setCustomFooter($scope, {
                templateUrl: "Areas/Management/app/spa/course_edit/CourseEditFooter.html"
            });

            var breadcrumbs = {
                sub: "New",
                rootState: "courses"
            };
            LayoutService.setBreadCrumbs($scope, breadcrumbs);
            $scope.$watch("course.title || 'New'", function(title) {
                breadcrumbs.sub = title;
            });

            // Confirm leave if has unsaved changes
            WindowService.beforeUnload($scope, function() {
                return $scope.needSaving() ? "Course changes hasn't been saved." : null;
            });

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                if ($scope.needSaving()) {
                    if (toState.name.indexOf("courseEdit.") != 0) {
                        if (!confirm("Course changes hasn't been saved." + "\n\nAre you sure want to leave this page?")) {
                            event.preventDefault();
                        }
                    } else {
                        event.preventDefault();
                        save().then(function() {
                            toParams.courseId = $scope.course.id;
                            $state.go(toState.name, toParams);
                        });
                    }
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
                    state: "sections.list",
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

            function save() {
                var defer = $q.defer();
                $scope.ce.saving = true;
                $scope.cel.save()
                    .then(function() {
                        $scope.ce.saving = false;
                        defer.resolve();
                    }, function(reason) {
                        $scope.ce.saving = false;
                        alert(reason);
                        defer.reject();
                    })
                ;
                return defer.promise;
            }

            $scope.save = function() {
                save().then(function() {
                    if ($stateParams.courseId == "new") {
                        $state.go($state.current.name, {courseId: $scope.course.id});
                    }
                });
            };
            $scope.reset = function() {
                if (!confirm("Are you sure to reset your changes")) {
                    return;
                }
                $scope.cel.reset();
            };

            $scope.prevPage = function() {
                $scope.toPage($scope.cel.step - 1);
            };
            $scope.nextPage = function() {
                $scope.toPage($scope.cel.step + 1);
            };
            $scope.toPage = function(page) {
                if ($scope.course==null) { return; }
                $state.go('courseEdit.' + $scope.steps[page].state, {courseId: $scope.course.id});
            };
        }])

        .directive("checkPublishedCourse", ["CourseService", function(CourseService) {
            return {
                restrict: "E",
                templateUrl: "Areas/Management/app/spa/course_edit/CheckPublishedCourse.html",
                link: function($scope, elem, attrs) {
                    $scope.$watch("course.status == 1", function(value) {
                        if (!value) {
                            elem.hide();
                        } else {
                            elem.show();
                        }
                    });

                    $scope.changeToDraft = function() {
                        $scope.course.status = status;
                        //return CourseService.setStatus($scope.course.id, 0).success(function() {
                        //    $scope.course.status = 0;
                        //});
                    };

                    $scope.dismiss = function() {
                        elem.hide();
                    }

                }
            };
        }])
    ;
})();
