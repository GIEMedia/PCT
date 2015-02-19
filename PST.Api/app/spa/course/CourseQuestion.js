"use strict";

(function () {

    angular.module('pct.elearning.course.question', [
    ])
        .directive("courseQuestion", function() {
            return {
                restrict: "A",
                require: "^courseQuestionsContainer",
                templateUrl: "/app/spa/course/CourseQuestion.html",
                scope: true,
                link: function($scope, elem, attrs, courseQuestionsContainerCtrl) {
                    var _question;
                    $scope.$watch(attrs.courseQuestion, function(question) {
                        if (question) {
                            $scope.answer = [];
                            _question = question;
                        }
                    });

                    // Extract the answer and submit to question container
                    $scope.submitAnswer = function() {
                        courseQuestionsContainerCtrl.submitAnswer($scope.answer);
                        return false;
                    };
                }
            };
        })

        .directive("eOptions", function() {
            return {
                restrict: "E",
                scope: {
                    "question": "=",
                    "answer": "="
                },
                templateUrl: "/app/spa/course/eOptions.html",
                link: function($scope, elem, attrs) {
                    $scope.view = {
                        answer : []
                    };

                    var extractAnswer = function() {
                        if ($scope.question==null) {
                            return "[]";
                        }

                        if ($scope.question.multi_select) {
                            var answer = [];
                            for (var i = 0; i < $scope.view.answer.length; i++) {
                                if ($scope.view.answer[i]) {
                                    answer.push($scope.question.options[i].option_id);
                                }
                            }
                            return JSON.stringify(answer);
                        } else {
                            return JSON.stringify($scope.view.answer);
                        }
                    };

                    $scope.$watch("question", function(value) {
                        $scope.view.answer = [];
                    });
                    $scope.$watch(extractAnswer, function(value) {
                        $scope.answer = JSON.parse(value);
                    });
                    $scope.$watch("answer", function(value) {
                        if ($scope.question == null && Cols.isEmpty(value)) {
                            return;
                        }
                        if ($scope.question.multi_select) {
                            $scope.view.answer = [];

                            var answer = [];
                            for (var i = 0; i < $scope.question.options.length; i++) {
                                answer[i] = value.indexOf($scope.question.options[i].option_id) > -1;
                            }
                            $scope.view.answer = answer;
                        } else {
                            $scope.view.answer = value;
                        }
                    });
                }
            };
        })

        // The magnify button in each pictured question option
        .directive("jsMagnify", function() {
            return {
                restrict: "C",
                link: function($scope, elem, attrs) {
                    elem.magnificPopup({
                        type: 'image',
                        mainClass: 'mfp-pdf'
                    })
                }
            };
        })
    ;

})();