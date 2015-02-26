"use strict";

(function () {

    angular.module('pct.elearning.test', [
            'pct.elearning.test.submit_ceu',
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
                    if ($scope.isPassed() || $scope.progress.retries_left == 0) {
                        $scope.showResult = true;
                    }
                }
            });

            $scope.isPassed = function() {
                if ($scope.progress == null || $scope.test == null) {
                    return false;
                }
                var correctCount = Cols.length($scope.progress.corrects);
                return correctCount == $scope.test.questions.length || (correctCount / $scope.test.questions.length >= $scope.test.passing_percentage && $scope.progress.retries_left == 0);
            };

            $scope.doSubmit = function() {
                TestService.submit($scope.model.answers, $stateParams.courseId, function(result) {
                    $scope.showResult = true;
                    Cols.mapAddAll(result, $scope.progress.corrects);
                    $scope.progress.retries_left--;
                });
            };

            $scope.nextRound = function() {
                $scope.showResult = false;
                $scope.model.answers = {};
            };

        }])

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
                        if ($scope.progress.retries_left > 1) {
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

                        if ($scope.progress.retries_left > 1) {
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