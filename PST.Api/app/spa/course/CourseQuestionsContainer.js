"use strict";

(function () {

    angular.module('pct.elearning.course.questionsContainer', [
    ])

        .directive("courseQuestionsContainer", function() {
            return {
                restrict: "C",
                require: "^course",
                templateUrl: "/app/spa/course/CourseQuestionsContainer.html",
                link: function($scope, elem, attrs, courseCtrl) {
                    console.log(attrs.section);
                    $scope.$watch(attrs.section, function(section) {
                        $scope.section = section;
                    });
                    $scope.nextSection = function() {
                        courseCtrl.nextSection();
                    };
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
                        var showingNextQuestion = ctrl.nextQuestion();
                        if (showingNextQuestion) {
                            ;
                        } else {
                            $scope.nextSection();
                        }
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

    ;

})();