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
                    var emptyAnswer = function() {
                        return {
                            checks: [],
                            choice: null
                        };
                    };

                    var _question;
                    $scope.$watch(attrs.courseQuestion, function(question) {
                        if (question) {
                            $scope.answer = emptyAnswer();
                            _question = question;
                        }
                    });

                    $scope.submitAnswer = function() {
                        var answer;
                        if (_question.type == "pictures") {
                            answer = [];
                            for (var i = 0; i < $scope.answer.checks.length; i++) {
                                if ($scope.answer.checks[i]) {
                                    answer.push(i);
                                }
                            }
                        } else if (["text","picture","video"].indexOf(_question.type) > -1) {
                            answer = $scope.answer.choice;
                        } else {
                            throw "Unknown type: " + _question.type;
                        }
                        courseQuestionsContainerCtrl.submitAnswer(answer);
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