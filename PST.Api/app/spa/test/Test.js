"use strict";

(function () {

    angular.module('pct.elearning.test', [
            'pct.elearning.test.submit_ceu',
            'ui.router'
    ])
    
        .config(function ($stateProvider) {

            $stateProvider
                .state('test', {
                    url: '/test/:courseId',
                    templateUrl: "/app/spa/test/TestPage.html",
                    controller: "test.Ctrl"
                })
            ;
        })

        .controller("test.Ctrl", function ($scope, TestService, $stateParams, CourseService) {
            $scope.testView = {
                progress: "0%"
            };
            $scope.model = {
                answer: [],
                answers: {}
            };

            TestService.get($stateParams.courseId).success(function(test) {
                $scope.test = test;

                test.passing_percentage = 0.1;

                CourseService.get($stateParams.courseId).success(function(course) {
                    $scope.test.title = course.title;
                });
            });

            $scope.isPassed = function() {
                if ($scope.result == null) {
                    return false;
                }
                return $scope.result.passed == 1 || ($scope.result.passed > $scope.test.passing_percentage && $scope.test.retries_left == 0);
            };

            $scope.doSubmit = function() {
                TestService.submit($scope.model.answers, $stateParams.courseId, function(result) {
                    $scope.result = result;
                });
            };

            $scope.nextRound = function() {

                $scope.test.retries_left--;

                for (var i = 0; i < $scope.test.questions.length; i++) {
                    var question = $scope.test.questions[i];

                    // Merge answer result into questions data
                    var correct = $scope.result.corrects[question.question_id];
                    if (correct != null) {
                        question.correct = correct;
                    } else {
                        question.correct = false;
                        delete $scope.model.answers[question.question_id];
                    }
                }

                $scope.result = null;
            };

            $scope.hasIdIn = function(col) {
                return function(e) {
                    return col.indexOf(e.option_id) > -1;
                }
            };
            $scope.length = Cols.length;

        })

        .directive("testQuestionsContainer", function() {
            return {
                restrict: "E",
                scope: false,
                templateUrl: "/app/spa/test/TestQuestionsContainer.html",
                link: function($scope, elem, attrs) {
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
                            if (question.correct == false) {
                                return question;
                            }
                        }
                        return null;
                    };

                    $scope.lastQuestion = function() {
                        if ($scope.test == null) {
                            return false;
                        }
                        if ($scope.test.retries_left > 1) {
                            return $scope.test.questions.indexOf($scope.question) == $scope.test.questions.length - 1;
                        } else {
                            var index = $scope.test.questions.indexOf($scope.question);
                            return nextFailedQuestion(index + 1) == null;
                        }
                    };


                    var acceptAnswer = function() {
                        if (!$scope.question.correct) {
                            $scope.model.answers[$scope.question.question_id] = $scope.model.answer;
                            $scope.model.answer = [];
                        }
                    };
                    $scope.next = function() {
                        acceptAnswer();

                        fetchNextQuestion();
                    };

                    $scope.submit = function() {
                        acceptAnswer();
                        $scope.question = null;
                        $scope.doSubmit();
                    };

                    var fetchNextQuestion = function() {
                        if ($scope.test.retries_left > 1) {
                            var index = $scope.test.questions.indexOf($scope.question);
                            $scope.question = $scope.test.questions[index + 1];
                            var oldAnswer = $scope.model.answers[$scope.question.question_id];
                            if (oldAnswer != null) {
                                $scope.model.answer = oldAnswer;
                            } else {
                                $scope.model.answer = [];
                            }
                        } else {
                            var index = $scope.test.questions.indexOf($scope.question);
                            $scope.question = nextFailedQuestion(index + 1);
                            $scope.model.answer = [];
                        }

                    };

                    $scope.$watch("test.questions", function(value) {
                        if (value != null) {
                            fetchNextQuestion();
                        }
                    });

                }
            };
        })

    ;

})();