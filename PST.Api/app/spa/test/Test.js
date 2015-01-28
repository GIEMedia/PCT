"use strict";

(function () {

    angular.module('pct.elearning.test', [
            'ui.router'
    ])
    
        .config(function ($stateProvider) {

            $stateProvider
                .state('test', {
                    url: '/test',
                    templateUrl: "/app/spa/test/Test.html",
                    controller: "test.Ctrl"
                })
            ;
        })

        .controller("test.Ctrl", function ($scope, TestService, $state) {
            $scope.questions = TestService.query(function() {
                $scope.question = $scope.questions[0];
            });

            $scope.answer = null;
            $scope.answers = [];

            $scope.next = function() {
                var index = $scope.questions.indexOf($scope.question);
                if (index < $scope.questions.length - 1) {
                    $scope.answers.push($scope.answer);
                    $scope.answer = null;
                    $scope.question = $scope.questions[index + 1];
                }
            };

            $scope.progress = function() {
                var index = $scope.questions.indexOf($scope.question);

                return Math.round(index / $scope.questions.length * 100) + "%";
            };

            $scope.lastQuestion = function() {
                return $scope.questions.indexOf($scope.question) == $scope.questions.length - 1;
            };

            $scope.submit = function() {
                TestService.submit($scope.answers);
            };
        })

    ;

})();