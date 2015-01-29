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
            $scope.round = 1;

            $scope.questions = TestService.query({}, function() {
                $scope.question = $scope.questions[0];
            });

            $scope.model = {
                answer: null,
                answers: []
            };

            var acceptAnswer = function() {
                $scope.model.answers.push($scope.model.answer);
                $scope.model.answer = null;
            };

            $scope.next = function() {
                acceptAnswer();

                var index = $scope.questions.indexOf($scope.question);
                $scope.question = $scope.questions[index + 1];
            };

            $scope.progress = function() {
                var index = $scope.model.answers.length;

                return Math.round(index / $scope.questions.length * 100) + "%";
            };

            $scope.lastQuestion = function() {
                return $scope.questions.indexOf($scope.question) == $scope.questions.length - 1;
            };

            $scope.submit = function() {
                acceptAnswer();

                $scope.result = TestService.submit({answers: $scope.answers, round: $scope.round});
            };
        })

    ;

})();