"use strict";

(function () {

    angular.module('pct.elearning.course.question', [
    ])
        .directive("courseQuestion", function(QuestionHelper) {
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
                        var answer = QuestionHelper.extractAnswer($scope.answer, _question);
                        courseQuestionsContainerCtrl.submitAnswer(answer);
                    };
                }
            };
        })

        .factory("QuestionHelper", function() {
            return {
                extractAnswer: function(scopeAnswer, question) {

                    if (question.multi_select) {
                        var answer = [];
                        for (var i = 0; i < scopeAnswer.length; i++) {
                            if (scopeAnswer[i]) {
                                answer.push(question.options[i].option_id);
                            }
                        }
                        return answer;
                    } else {
                        return scopeAnswer;
                    }
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