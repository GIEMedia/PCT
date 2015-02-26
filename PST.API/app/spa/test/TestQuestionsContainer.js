"use strict";

(function () {

    angular.module('pct.elearning.test.questions', [
    ])

        .directive("testQuestionsContainer", function() {
            return {
                restrict: "E",
                scope: true,
                templateUrl: "/app/spa/test/TestQuestionsContainer.html",
                link: function($scope, elem, attrs) {
                    $scope.tqc = {
                        answer: []
                    };

                    $scope.$watch("question", function(value) {
                        if (value == null) {
                            $scope.testView.progress = "100%";
                            return;
                        }
                        var index = $scope.test.questions.indexOf(value);
                        $scope.testView.progress = Math.round(index / $scope.test.questions.length * 100) + "%";
                    });

                    var nextFailedQuestion = function(index) {
                        if (index == -1) {
                            index = 0;
                        }
                        for (;index < $scope.test.questions.length;index++) {
                            var question = $scope.test.questions[index];

                            var correctModel = $scope.progress.corrects[question.question_id];
                            if (correctModel == null) {
                                return question;
                            }
                        }
                        return null;
                    };

                    $scope.lastQuestion = function() {
                        if ($scope.test == null || $scope.progress == null) {
                            return false;
                        }
                        if ($scope.progress.tries_left > 1) {
                            return $scope.test.questions.indexOf($scope.question) == $scope.test.questions.length - 1;
                        } else {
                            var index = $scope.test.questions.indexOf($scope.question);
                            return nextFailedQuestion(index + 1) == null;
                        }
                    };


                    var acceptAnswer = function() {
                        var correctModel = $scope.progress.corrects[$scope.question.question_id];
                        if (correctModel == null) {
                            $scope.model.answers[$scope.question.question_id] = $scope.tqc.answer;
                            $scope.tqc.answer = [];
                        }
                    };
                    $scope.next = function() {
                        acceptAnswer();

                        fetchNextQuestion();
                    };

                    $scope.submit = function() {
                        acceptAnswer();
                        $scope.doSubmit();
                    };

                    var fetchNextQuestion = function() {
                        $scope.tqc.answer = [];
                        var index = $scope.test.questions.indexOf($scope.question);

                        if ($scope.progress.tries_left > 1) {
                            $scope.question = $scope.test.questions[index + 1];
                        } else {
                            $scope.question = nextFailedQuestion(index + 1);
                        }

                    };

                    var waitTestAvai = Async.ladyFirst();
                    $scope.$watch(function() { return $scope.test != null && $scope.progress != null;}, function(value) {
                        if (value) {
                            waitTestAvai.ladyDone();
                        }
                    });

                    $scope.$watch("showResult", function(value) {
                        if (value != null && !value) {
                            waitTestAvai.manTurn(function() {
                                fetchNextQuestion();
                            });
                        }
                    });

                    $scope.hasIdIn = function(col) {
                        return function(e) {
                            return col.indexOf(e.option_id) > -1;
                        }
                    };
                }
            };
        })

    ;

})();