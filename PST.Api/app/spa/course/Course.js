"use strict";

(function () {

    angular.module('pct.elearning.course', [
        'pct.elearning.course.slider',
        'pct.elearning.course.questionsContainer',
        'pct.elearning.course.controls',
        'ui.router'
    ])

        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('course', {
                    url: '/course/:id',
                    templateUrl: "/app/spa/course/CoursePage.html",
                    controller: "course.Ctrl"
                })
            ;
        }])

        .controller("course.Ctrl", ["$scope", "CourseService", "$stateParams", "PreferenceService", function ($scope, CourseService, $stateParams, PreferenceService) {
            CourseService.get($stateParams.id).success(function(course) {
                $scope.course = course;
            });
            CourseService.getProgress($stateParams.id, function(progress) {
                $scope.progress = progress;
            });

            $scope.courseHelp = PreferenceService.isHelpEnabled();
        }])

        .directive("course", function() {
            return {
                restrict: "C",
                templateUrl: "/app/spa/course/Course.html",
                controller: ["$scope", function($scope) {

                    var ctrl = this;
                    // Section navigation
                    ctrl.gotoSection = function(sectionNum) {
                        $scope.section = $scope.course.sections[sectionNum - 1];
                        if (!$scope.$$phase) $scope.$digest();
                    };
                    ctrl.nextSection = function() {
                        var indexOf = $scope.course.sections.indexOf($scope.section);
                        if (indexOf == $scope.course.sections.length - 1) {
                            return;
                        }
                        ctrl.gotoSection(indexOf + 1 + 1);
                    };
                    ctrl.prevSection = function() {
                        var indexOf = $scope.course.sections.indexOf($scope.section);
                        if (indexOf == 0) {
                            return;
                        }
                        ctrl.gotoSection(indexOf + 1 - 1);
                    };
                    ctrl.sectionNum = function() {
                        return $scope.course ==null ? 0 : $scope.course.sections.indexOf($scope.section) + 1;
                    };

                    // Section query
                    ctrl.finishedAllSection = function() {
                        if ($scope.course == null || $scope.progress == null) {
                            return false;
                        }

                        for (var i = 0; i < $scope.course.sections.length; i++) {
                            var sec = $scope.course.sections[i];
                            if (!($scope.progress[sec.section_id] >= sec.questions.length)) {
                                return false;
                            }
                        }
                        return true;
                    };

                    // Change to next unfinished section
                    $scope.nextUnfinishedSection = function() {
                        for (var i = 0; i < $scope.course.sections.length; i++) {
                            var sec = $scope.course.sections[i];
                            if (!($scope.progress[sec.section_id] >= sec.questions.length)) {
                                ctrl.gotoSection(i+1);
                                return true;
                            }
                        }
                        return false;
                    };
                    ctrl.nextUnfinishedSection = $scope.nextUnfinishedSection;
                }],
                link: function($scope, elem, attrs) {

                    var waitProgress = Async.ladyFirst();

                    $scope.$watch("progress", function(value) {
                        if (value) {
                            waitProgress.ladyDone();
                        }
                    });

                    $scope.$watch("course", function(course) {
                        if (course) {
                            waitProgress.manTurn(function() {
                                var hasSection = $scope.nextUnfinishedSection();
                                if (!hasSection) {
                                    $scope.section = $scope.course.sections[0];
                                }
                            });
                        }
                    });

                }
            };
        })


    ;

})();