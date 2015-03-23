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
                    abstract: true,
                    templateUrl: "Areas/Management/app/spa/course_edit/CourseEdit.html",
                    controller: "courseEdit.Ctrl"
                })
            ;
        })

        .controller("courseEdit.Ctrl", function ($scope, $state, $q, $stateParams, LayoutService, CourseService, WindowService) {
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
                        $scope.saveCourse().then(function() {
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

            $scope.saveCourse = function() {
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
            };

            $scope.prevPage = function() {
                $state.go('courseEdit.' + $scope.steps[$scope.cel.step - 1].state, {courseId: $scope.course.id});
            };
            $scope.nextPage = function() {
                $state.go('courseEdit.' + $scope.steps[$scope.cel.step + 1].state, {courseId: $scope.course.id});
            };
            $scope.toPage = function(page) {
                $state.go('courseEdit.' + $scope.steps[page].state, {courseId: $scope.course.id});
            };
        })

    ;
})();
