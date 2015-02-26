"use strict";

(function () {

    angular.module('pct.elearning.test', [
            'pct.elearning.test.submit_ceu',
            'pct.elearning.test.questions',
            'ui.router'
    ])
    
        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('test', {
                    url: '/test/:courseId',
                    templateUrl: "/app/spa/test/TestPage.html",
                    controller: "test.Ctrl"
                })
            ;
        }])

        .controller("test.Ctrl", ["$scope", "TestService", "$stateParams", function ($scope, TestService, $stateParams) {
            $scope.testView = {
                progress: "100%"
            };
            $scope.model = {
                answers: {}
            };
            $scope.progress = null;
            $scope.showResult = false;

            TestService.get($stateParams.courseId).success(function(test) {
                $scope.test = test;
            });

            TestService.getProgress($stateParams.courseId, function(progress) {
                $scope.progress = progress;
            });

            $scope.$watch(function() { return $scope.test != null && $scope.progress != null;}, function(value) {
                if (value) {
                    if ($scope.isPassed() || $scope.progress.tries_left == 0) {
                        $scope.showResult = true;
                    }
                }
            });

            $scope.isPassed = function() {
                if ($scope.progress == null || $scope.test == null) {
                    return false;
                }
                var correctCount = Cols.length($scope.progress.corrects);
                return correctCount == $scope.test.questions.length || (correctCount / $scope.test.questions.length >= $scope.test.passing_percentage && $scope.progress.tries_left == 0);
            };

            $scope.doSubmit = function() {
                TestService.submit($scope.model.answers, $stateParams.courseId, function(result) {
                    $scope.showResult = true;
                    Cols.mapAddAll(result, $scope.progress.corrects);
                    $scope.progress.tries_left--;
                });
            };

            $scope.nextRound = function() {
                $scope.showResult = false;
                $scope.model.answers = {};
            };

        }])

        .directive("testPassed", function() {
            return {
                restrict: "E",
                templateUrl: "/app/spa/test/TestPassed.html",
                link: function($scope, elem, attrs) {
                }
            };
        })
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