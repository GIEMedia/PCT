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
                .state('coursePreview', {
                    url: '/course/:id/preview?token',
                    templateUrl: "/app/spa/course/CoursePage.html",
                    controller: "course.PreviewCtrl"
                })
            ;
        }])

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

                // To test option type image
                //var question = course.sections[0].questions[0];
                //question.option_type = 1;
                //Cols.each(question.options, function(option) {
                //    option.image = "/app/css/images/temp/img-answer1.jpg";
                //});
            });
            CourseService.getProgress($stateParams.id, function(progress) {
                $scope.progress = progress;

                //ObjectUtil.clear(progress);
                //console.log(progress);
            });

            $scope.helpEnabled = !$scope.previewMode && PreferenceService.isCourseHelpEnabled();

            $scope.disableHelp = function() {
                PreferenceService.setCourseHelpEnabled(false);
            }
        }])
        .controller("course.PreviewCtrl", ["$scope", "CourseService", "$stateParams", "PreferenceService", function ($scope, CourseService, $stateParams, PreferenceService) {
            CourseService.getPreview($stateParams.id, $stateParams.token).success(function (course) {
                $scope.course = course;

                // To test option type image
                //var question = course.sections[0].questions[1];
                //question.option_type = 1;
                //Cols.each(question.options, function(option) {
                //    option.image = "/app/css/images/temp/img-answer1.jpg";
                //});
            });
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
                    $scope.nextSection = function() {
                        var indexOf = $scope.course.sections.indexOf($scope.section);
                        if (indexOf == $scope.course.sections.length - 1) {
                            return;
                        }
                        ctrl.gotoSection(indexOf + 1 + 1);
                    };
                    $scope.prevSection = function() {
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
                    $scope.finishedAllSection = function() {
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
                }],
                link: function($scope, elem, attrs) {
                    $scope.previewMode = $scope.$eval(attrs.previewMode);
                    if ($scope.previewMode) {

                        $scope.$watch("course", function(course) {
                            if (course) {
                                $scope.section = $scope.course.sections[0];
                            }
                        });
                    } else {

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

                }
            };
        })


    ;

})();