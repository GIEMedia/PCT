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

                    $scope.submitAnswer = function() {
                        var answer;
                        if (_question.multi_select) {
                            answer = [];
                            for (var i = 0; i < $scope.answer.length; i++) {
                                if ($scope.answer[i]) {
                                    answer.push($scope.question.options[i].option_id);
                                }
                            }
                        } else {
                            answer = $scope.answer;
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