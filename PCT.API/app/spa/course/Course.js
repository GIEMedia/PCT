"use strict";

(function () {

    angular.module('pct.elearning.course', [
        "pct.elearning.course.slider",
        'pct.elearning.course.document-viewer',
        'pct.elearning.course.questions-viewer',
        'pct.elearning.course.controls',
        'pct.elearning.course.verification-modal',
        "pct.common.timer-service",
        'ui.router'
    ])

        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('coursePreview', {
                    url: '/course/:id/preview?token',
                    templateUrl: "app/spa/course/course.html?v=" + htmlVer,
                    controller: "course.PreviewCtrl"
                })
            ;
        }])

        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('course', {
                    url: '/course/:id',
                    templateUrl: "app/spa/course/course.html?v=" + htmlVer,
                    controller: "course.Ctrl"
                })
            ;
        }])
        .controller("course.Ctrl", ["$scope", "CourseService", "$stateParams", "PreferenceService", "verificationModal", "timerService", "$controller", function (
            $scope, CourseService, $stateParams, PreferenceService, verificationModal, timerService, $controller) {

            var verificationModalInstance = null;
            CourseService.getProgress($stateParams.id).then(function (progressCourse) {
                if(progressCourse.config.need_verification) {
                    verificationModalInstance = verificationModal.open();
                }
                $scope.progressCourse = progressCourse;
            }).then(function () {
                if(verificationModalInstance) {
                    verificationModalInstance.result.then(function () {
                        $scope.$applyAsync(function () {
                            $scope.helpEnabled = !$scope.previewMode && PreferenceService.isCourseHelpEnabled();
                        });
                    });
                } else {
                    verificationModalInstance = null;
                }
            });

            //// Dev
            //setTimeout(function() {
            //    verificationModalInstance.dismiss();
            //}, 100);
            CourseService.incrementCourseActivity($stateParams.id, 0).then(function (resp) {
                var timeConsumption = resp.data;
                timerService.start("Course", timeConsumption);
            });

            //// Dev
            //$scope.helpEnabled = true;

            // TODO  timerService.stop(); when finished
            $scope.$on('$destroy', function() {
                timerService.stop();
                if(verificationModalInstance) {
                    verificationModalInstance.dismiss();
                }
            });

            $scope.stopTimer = timerService.stop;

            CourseService.get($stateParams.id).then(function(resp) {
                $scope.course = resp.data;

                // To test option type image
                //var question = course.sections[0].questions[0];
                //question.option_type = 1;
                //Cols.each(question.options, function(option) {
                //    option.image = "/app/css/images/temp/img-answer1.jpg";
                //});
            });

            $scope.disableHelp = function($value) {
                PreferenceService.setCourseHelpEnabled($value);
            };


            $controller("course-base.ctrl", {$scope: $scope});
        }])

        .controller("course.PreviewCtrl", ["$scope", "$stateParams", "CourseService", "$controller", function ($scope, $stateParams, CourseService, $controller) {
            CourseService.getPreview($stateParams.id, $stateParams.token).success(function (course) {
                $scope.course = course;

                // To test option type image
                //var question = course.sections[0].questions[1];
                //question.option_type = 1;
                //Cols.each(question.options, function(option) {
                //    option.image = "/app/css/images/temp/img-answer1.jpg";
                //});
            });

            $scope.previewMode = true;

            $controller("course-base.ctrl", {$scope: $scope});
        }])

        .controller("course-base.ctrl", ["$scope", "$state", function($scope, $state) {

            $scope.view = {
                questionsControl: null,
                section: null
            };
            $scope.nextSection = function() {
                var indexOf = $scope.course.sections.indexOf($scope.view.section);
                if (indexOf == $scope.course.sections.length - 1) {
                    return;
                }
                $scope.view.section = $scope.course.sections[indexOf + 1];
            };
            $scope.prevSection = function() {
                var indexOf = $scope.course.sections.indexOf($scope.view.section);
                if (indexOf == 0) {
                    return;
                }
                $scope.view.section = $scope.course.sections[indexOf - 1];
            };

        }])



    ;

})();