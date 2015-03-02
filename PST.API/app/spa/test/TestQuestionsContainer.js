"use strict";

(function () {

    angular.module('pct.elearning.test.questions', [
    ])

        .directive("testQuestionsContainer", function() {
            return {
                restrict: "E",
                scope: {
                    reportProgress: "=",
                    questions: "=",
                    sendResult: "&",
                    progress: "="
                },
                templateUrl: "/app/spa/test/TestQuestionsContainer.html",
                link: function($scope, elem, attrs) {
                    $scope.tqc = {
                        answer: [],
                        answers: {}
                    };

                    // Report progress
                    $scope.$watch("question", function(value) {
                        if (value == null) {
                            return;
                        }
                        var index = $scope.questions.indexOf(value);
                        $scope.reportProgress = Math.round(index / $scope.questions.length * 100) + "%";
                    });


                    var nextFailedQuestion = function(index) {
                        if (index == -1) {
                            index = 0;
                        }
                        for (;index < $scope.questions.length;index++) {
                            var question = $scope.questions[index];

                            var correctModel = $scope.progress.corrects[question.question_id];
                            if (correctModel == null) {
                                return question;
                            }
                        }
                        return null;
                    };

                    $scope.lastQuestion = function() {
                        if ($scope.questions == null || $scope.progress == null) {
                            return false;
                        }
                        if ($scope.progress.tries_left > 1) {
                            return $scope.questions.indexOf($scope.question) == $scope.questions.length - 1;
                        } else {
                            var index = $scope.questions.indexOf($scope.question);
                            return nextFailedQuestion(index + 1) == null;
                        }
                    };

                    var acceptAnswer = function() {
                        var correctModel = $scope.progress.corrects[$scope.question.question_id];
                        if (correctModel == null) {
                            $scope.tqc.answers[$scope.question.question_id] = $scope.tqc.answer;
                            $scope.tqc.answer = [];
                        }
                    };
                    $scope.next = function() {
                        acceptAnswer();

                        fetchNextQuestion();
                    };

                    $scope.submit = function() {
                        acceptAnswer();

                        $scope.sendResult({"$answers": $scope.tqc.answers});

                        $scope.tqc.answers = {};
                    };

                    var fetchNextQuestion = function() {
                        $scope.tqc.answer = [];
                        var index = $scope.questions.indexOf($scope.question);

                        if ($scope.progress.tries_left > 1) {
                            $scope.question = $scope.questions[index + 1];
                        } else {
                            $scope.question = nextFailedQuestion(index + 1);
                        }

                    };


                    $scope.$watch("questions!=null && progress!=null", function(value) {
                        if (value) {
                            fetchNextQuestion();
                        }
                    });

                    /**
                     * Check question option, return if its id is in col
                     * @param col
                     * @returns {Function}
                     */
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