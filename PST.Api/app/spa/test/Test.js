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

        .controller("test.Ctrl", function ($scope, TestService, $stateParams) {
            $scope.testView = {
                progress: "100%"
            };
            $scope.model = {
                answers: {}
            };

            // TODO
            //$scope.result = {
            //    passed: 0
            //};

            TestService.get($stateParams.courseId).success(function(test) {
                $scope.test = test;

                // TODO
                test.title = "Mock Test title";
                //test.retries_left = 0;
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
                    $scope.test.retries_left--;
                });
            };

            $scope.nextRound = function() {
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
                        $scope.question = null;
                        $scope.doSubmit();
                    };

                    var fetchNextQuestion = function() {
                        if ($scope.test.retries_left > 1) {
                            var index = $scope.test.questions.indexOf($scope.question);
                            $scope.question = $scope.test.questions[index + 1];
                            var oldAnswer = $scope.model.answers[$scope.question.question_id];
                            if (oldAnswer != null) {
                                $scope.tqc.answer = oldAnswer;
                            } else {
                                $scope.tqc.answer = [];
                            }
                        } else {
                            var index = $scope.test.questions.indexOf($scope.question);
                            $scope.question = nextFailedQuestion(index + 1);
                            $scope.tqc.answer = [];
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
                }
            };
        })
    ;

})();