"use strict";

(function () {

    angular.module('pct.elearning.course.questions', [
    ])
        .directive("courseQuestions", function() {
            return {
                restrict: "C",
                require: "^courseQuestionsContainer",
                templateUrl: "/app/spa/course/CourseQuestions.html",
                scope: true,
                link: function($scope, elem, attrs, courseQuestionsContainerCtrl) {
                    var emptyAnswer = function() {
                        return {
                            checkeds: [],
                            choice: null
                        };
                    };
                    $scope.answer = emptyAnswer();
                    $scope.correctAnswer = false;

                    var _questions;
                    $scope.$watch(attrs.questions, function(questions) {
                        _questions = questions;
                        if (questions) {
                            $scope.question = questions[0];
                        }

                    });

                    $scope.submitAnswer = function() {
                        if ($scope.question.type == "pictures") {
                            var answer = [];
                            for (var i = 0; i < $scope.answer.checkeds.length; i++) {
                                if ($scope.answer.checkeds[i]) {
                                    answer.push(i);
                                }
                            }
                        } else if (["text","picture","video"].indexOf($scope.question.type) > -1) {
                            var answer = $scope.answer.choice == null ? -1 : $scope.answer.choice * 1;
                        }

                        if (ObjectUtil.equals(answer, $scope.question.answer)) {
                            $scope.correctAnswer = true;
                            courseQuestionsContainerCtrl.showResult(true, $scope.question.explanation);
                        } else {
                            courseQuestionsContainerCtrl.showResult(false);
                        }
                    };

                    courseQuestionsContainerCtrl.nextQuestion = function() {
                        $scope.correctAnswer = false;
                        $scope.answer = emptyAnswer();
                        var indexOf = _questions.indexOf($scope.question);
                        $scope.question = _questions[indexOf + 1];
                        courseQuestionsContainerCtrl.showResult(null);
                    };

                    courseQuestionsContainerCtrl.progress = function() {
                        var indexOf = _questions == null ? 0 : _questions.indexOf($scope.question);
                        return indexOf;
                    };
                }
            };
        })

        .directive("courseQuestionsContainer", function() {
            return {
                restrict: "C",
                templateUrl: "/app/spa/course/CourseQuestionsContainer.html",
                link: function($scope, elem, attrs) {
                    $scope.$watch("course", function(course) {
                        if (course != null) {
                            $scope.section = course.sections[0];
                        }
                    });

                },
                controller: function($scope) {
                    $scope.result = null;

                    var ctrl = this;
                    ctrl.nextQuestion = null;
                    ctrl.progress = null;

                    $scope.progress = function() {
                        return ctrl.progress ? ctrl.progress() : 0;
                    };
                    $scope.nextQuestion = function() {
                        ctrl.nextQuestion();
                        return false;
                    };

                    ctrl.showResult = function(passed, explanation) {
                        $scope.result = passed == null ? null : {
                            passed: passed,
                            explanation: explanation
                        };
                        if (!$scope.$$phase) $scope.$digest();
                    };
                }
            };
        })

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