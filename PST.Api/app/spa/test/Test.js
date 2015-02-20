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
            $scope.model = {
                answer: [],
                answers: {}
            };


            // Un-comment code below to develop Submit licensure form
            //$scope.result = {
            //    passed: 1
            //};

            TestService.get($stateParams.courseId).success(function(test) {
                $scope.test = test;

                // TODO Temp: waiting for real API from Oleg
                if (test.retries_left == null) {
                    test.retries_left = 3;
                }
                fetchNextQuestion();
            });

            var acceptAnswer = function() {
                if (!$scope.question.correct) {
                    $scope.model.answers[$scope.question.question_id] = $scope.model.answer;
                    $scope.model.answer = [];
                }
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

            $scope.next = function() {
                acceptAnswer();

                fetchNextQuestion();
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

            $scope.submit = function() {
                acceptAnswer();

                TestService.submit($scope.model.answers, $stateParams.courseId, function(result) {
                    $scope.result = result;
                    if (result.passed == 1 || (result.passed)) {
                        CourseService.get($stateParams.courseId).success(function(course) {
                            $scope.test.title = course.title;
                        });
                    }
                });

                $scope.question = null;
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
                fetchNextQuestion();
            };



            $scope.hasIdIn = function(col) {
                return function(e) {
                    return col.indexOf(e.option_id) > -1;
                }
            };
            $scope.length = Cols.length;

            $scope.progress = function() {
                if ($scope.question == null) {
                    return "100%";
                }
                var index = $scope.test.questions.indexOf($scope.question);

                return Math.round(index / $scope.test.questions.length * 100) + "%";
            };

        })

    ;

})();