"use strict";

(function () {

    angular.module('pct.elearning.course.questions', [
    ])
        .directive("courseQuestions", function($state) {
            return {
                restrict: "C",
                templateUrl: "/app/spa/course/CourseQuestions.html",
                scope: true,
                link: function($scope, elem, attrs) {
                    var _questions;
                    $scope.$watch(attrs.questions, function(questions) {
                        _questions = questions;
                        if (questions) {
                            $scope.question = questions[0];
                        }

                    });
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