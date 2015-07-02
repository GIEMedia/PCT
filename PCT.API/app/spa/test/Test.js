"use strict";

(function () {

    angular.module('pct.elearning.test', [
        'pct.elearning.test.questions',
        'pct.help',
        'ui.router'
    ])
    
        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('testPreview', {
                    url: '/test/:courseId/preview?token',
                    templateUrl: "/app/spa/test/TestPage.html",
                    controller: "test.Ctrl"
                })
            ;
        }])
        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('test', {
                    url: '/test/:courseId',
                    templateUrl: "/app/spa/test/TestPage.html",
                    controller: "test.Ctrl"
                })
            ;
        }])

        .controller("test.Ctrl", ["$scope", "TestService", "$stateParams", "$state", "PreferenceService", function ($scope, TestService, $stateParams, $state, PreferenceService) {
            $scope.testView = {
                questionProgress: "100%"
            };

            /**
             * Keeps the user progress for the whole test.
             * Will be updated to reflect the progress change in server (when user proceed)
             * @type {null}
             */
            $scope.progress = null;

            /**
             * Show or not the current progress. This will be set after user submit answers, or when the whole test is passed for failed (with tries==0)
             * @type {boolean}
             */
            $scope.showResult = false;

            $scope.previewMode = $state.current.name.indexOf('Preview') > -1;

            var getTest = $scope.previewMode ? TestService.getPreview : TestService.get;
            getTest($stateParams.courseId, $stateParams.token).success(function (test) {
                $scope.test = test;


                // To test option type image
                //var question = test.questions[0];
                //question.option_type = 1;
                //Cols.each(question.options, function(option) {
                //    option.image = "/app/css/images/temp/img-answer1.jpg";
                //});
            });

            if (!$scope.previewMode) {
                TestService.getProgress($stateParams.courseId, function(progress) {
                    $scope.progress = progress;
                });

                /**
                 * Check when both test and progress is available then decide to show result, or go to certificate page immediately
                 */
                $scope.$watch("test != null && progress != null", function(ready) {
                    if (ready) {
                        if ($scope.isPassed()) {
                            $state.go("certificate", {courseId: $stateParams.courseId});
                        } else if ($scope.progress.tries_left == 0) {
                            $scope.showResult = true;
                        }
                    }
                });
            }

            $scope.isPassed = function() {
                if ($scope.progress == null || $scope.test == null) {
                    return false;
                }
                var correctCount = Cols.length($scope.progress.corrects);
                return correctCount == $scope.test.questions.length || (correctCount / $scope.test.questions.length >= $scope.test.passing_percentage && $scope.progress.tries_left == 0);
            };

            /**
             * Send user answers to be checked on server, then update local progress to reflect server progress
             * @param answers
             */
            $scope.sendResult = function(answers) {
                return TestService.submit(answers, $stateParams.courseId, function (result) {
                    Cols.mapAddAll(result, $scope.progress.corrects);
                    $scope.progress.tries_left--;

                    if ($scope.isPassed()) {
                        $state.go("certificate", {courseId: $stateParams.courseId});
                    } else {
                        $scope.showResult = true;
                    }
                });
            };

            /**
             * Hide result, so the TestQuestionsContainer will automatically fetch first question to continue next round
             */
            $scope.nextRound = function() {
                $scope.showResult = false;
            };

            $scope.helpEnabled = !$scope.previewMode && PreferenceService.isTestHelpEnabled();

            $scope.disableHelp = function() {
                PreferenceService.setTestHelpEnabled(false);
            }
        }])

        .directive("testFailed", function() {
            return {
                restrict: "E",
                templateUrl: "/app/spa/test/TestFailed.html",
                link: function($scope, elem, attrs) {
                    $scope.length = Cols.length;
                }
            };
        })
    ;

})();