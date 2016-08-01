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
                    progress: "=",
                    previewMode: "="
                },
                templateUrl: "/app/spa/test/test-question-container/test-questions-container.html?v=" + htmlVer,
                link: function($scope, elem, attrs) {
                    $scope.tqc = {
                        answer: [],
                        answers: {},
                        submitting: false
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

                        $scope.tqc.submitting = true;
                        $scope.sendResult({"$answers": $scope.tqc.answers}).then(function() {
                            $scope.tqc.submitting = false;
                        });

                        $scope.tqc.answers = {};
                    };

                    var fetchNextQuestion = function() {
                        $scope.tqc.answer = [];
                        var index = $scope.questions.indexOf($scope.question);

                        if ($scope.previewMode || $scope.progress.tries_left > 1) {
                            $scope.question = $scope.questions[index + 1];
                        } else {
                            $scope.question = nextFailedQuestion(index + 1);
                        }

                    };


                    $scope.$watch("questions!=null && (progress!=null || previewMode)", function(value) {
                        if (value) {
                            fetchNextQuestion();
                        }
                    });

                    // Returns index of this question in the sequence of questions
                    $scope.questionIndex = function() {
                        return $scope.questions == null ? 0 : $scope.questions.indexOf($scope.question);
                    };

                    // Move on to the next question
                    $scope.nextQuestion = function() {
                        var indexOf = $scope.questions.indexOf($scope.question);
                        $scope.question = $scope.questions[indexOf + 1];
                    };

                    $scope.prevQuestion = function() {
                        var indexOf = $scope.questions.indexOf($scope.question);
                        $scope.question = $scope.questions[indexOf - 1];
                    };

                    $scope.correctAnswer = function(question) {
                        if (question==null) {
                            return null;
                        }
                        if ($scope.previewMode) {
                            return $scope.question == null ? null : $scope.question.answer;
                        } else {
                            return $scope.progress == null ? null : $scope.progress.corrects[question.question_id];
                        }
                    };

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