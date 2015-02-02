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

        .controller("test.Ctrl", function ($scope, TestService) {
            $scope.round = 1;

            $scope.model = {
                answer: null,
                answers: []
            };

            var acceptAnswer = function() {
                $scope.model.answers[$scope.test.questions.indexOf($scope.question)] = ($scope.model.answer);
                $scope.model.answer = null;
            };

            var nextFailedQuestion = function(index) {
                if (index == -1) {
                    index = 0;
                }
                for (;index < $scope.test.questions.length;index++) {
                    var question = $scope.test.questions[index];
                    if (question.correct == false) {
                        return question;
                    }
                }
                return null;
            };

            var fetchNextQuestion = function() {
                if ($scope.round != 3) {
                    var index = $scope.test.questions.indexOf($scope.question);
                    $scope.question = $scope.test.questions[index + 1];
                    if ($scope.model.answers.length > index + 1) {
                        $scope.model.answer = $scope.model.answers[index + 1];
                    } else {
                        $scope.model.answer = null;
                    }
                } else {
                    var index = $scope.test.questions.indexOf($scope.question);
                    $scope.question = nextFailedQuestion(index);
                    $scope.model.answer = null;
                }

            };

            $scope.test = TestService.query({}, fetchNextQuestion);

            $scope.next = function() {
                acceptAnswer();

                fetchNextQuestion();
            };

            $scope.progress = function() {
                if ($scope.question == null) {
                    return "100%";
                }
                var index = $scope.test.questions.indexOf($scope.question);

                return Math.round(index / $scope.test.questions.length * 100) + "%";
            };

            $scope.lastQuestion = function() {
                return $scope.test.questions.indexOf($scope.question) == $scope.test.questions.length - 1;
            };

            $scope.submit = function() {
                acceptAnswer();

                $scope.question = null;
                $scope.model.answer = null;

                $scope.result = TestService.submit({answers: $scope.model.answers, round: $scope.round});
            };

            $scope.nextRound = function() {
                function getCorrect(i, corrects) {
                    for (var j = 0; j < corrects.length; j++) {
                        var correct = corrects[j];
                        if (correct.question * 1 == i) {
                            return correct;
                        }
                    }
                    return null;
                }

                $scope.round++;

                for (var i = 0; i < $scope.test.questions.length; i++) {
                    var question = $scope.test.questions[i];

                    var correct = getCorrect(i, $scope.result.corrects);
                    if (correct != null) {
                        question.correct = true;
                        question.explanation = correct.explanation;
                    } else {
                        question.correct = false;
                        $scope.model.answers[i] = null;
                    }
                }

                $scope.result = null;
                fetchNextQuestion();
            };
        })

    ;

})();