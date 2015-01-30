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
                        courseQuestionsContainerCtrl.showResult(null);

                        var indexOf = _questions.indexOf($scope.question);
                        if (indexOf > -1) {
                            $scope.question = _questions[indexOf + 1];
                            return true;
                        } else {
                            return false;
                        }
                    };

                    courseQuestionsContainerCtrl.progress = function() {
                        return _questions == null ? 0 : _questions.indexOf($scope.question);
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