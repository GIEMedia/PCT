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


            $scope.model = {
                answer: null,
                answers: []
            };

            var acceptAnswer = function() {
                $scope.model.answers[$scope.questions.indexOf($scope.question)] = ($scope.model.answer);
                $scope.model.answer = null;
            };

            var nextFailedQuestion = function(index) {
                if (index == -1) {
                    index = 0;
                }
                for (;index < $scope.questions.length;index++) {
                    var question = $scope.questions[index];
                    if (question.correct == false) {
                        return question;
                    }
                }
                return null;
            };

            var fetchNextQuestion = function() {
                if ($scope.round != 3) {
                    var index = $scope.questions.indexOf($scope.question);
                    $scope.question = $scope.questions[index + 1];
                    if ($scope.model.answers.length > index + 1) {
                        $scope.model.answer = $scope.model.answers[index + 1];
                    } else {
                        $scope.model.answer = null;
                    }
                } else {
                    var index = $scope.questions.indexOf($scope.question);
                    $scope.question = nextFailedQuestion(index);
                    $scope.model.answer = null;
                }

            };

            $scope.questions = TestService.query({}, fetchNextQuestion);

            $scope.next = function() {
                acceptAnswer();

                fetchNextQuestion();
            };

            $scope.progress = function() {
                if ($scope.question == null) {
                    return "100%";
                }
                var index = $scope.questions.indexOf($scope.question);

                return Math.round(index / $scope.questions.length * 100) + "%";
            };

            $scope.lastQuestion = function() {
                return $scope.questions.indexOf($scope.question) == $scope.questions.length - 1;
            };

            $scope.submit = function() {
                acceptAnswer();

                $scope.question = null;
                $scope.model.answer = null;

                $scope.result = TestService.submit({answers: $scope.answers, round: $scope.round}, function() {
                    if ($scope.result.passed) {
                        $state.go("testPass");
                    }
                });
            };

            $scope.nextRound = function() {
                var setCorrectQuestions = function() {

                    for (var i in $scope.result.corrects) {
                        if ($scope.result.corrects.hasOwnProperty(i)) {

                            var correct = $scope.result.corrects[i];
                            var question = $scope.questions[correct.question * 1];
                            question.correct = true;
                            question.explanation = correct.explanation;
                        }
                    }
                };

                if ($scope.round == 1) {
                    for (var i in $scope.questions) {
                        if ($scope.questions.hasOwnProperty(i)) {
                            $scope.questions[i].correct = false;
                        }
                    }
                    setCorrectQuestions();

                    $scope.result = null;
                    fetchNextQuestion();
                } else if ($scope.round == 2) {

                    setCorrectQuestions();

                    $scope.result = null;
                    fetchNextQuestion();
                }
                $scope.round++;
            };
        })

    ;

})();