"use strict";

(function () {

    angular.module('pct.elearning.course.questionsContainer', [
    ])

        .directive("courseQuestionsContainer", function() {
            return {
                restrict: "C",
                require: "^course",
                scope: true,
                templateUrl: "/app/spa/course/CourseQuestionsContainer.html",
                link: function($scope, elem, attrs, courseCtrl) {

                    var ladyUserProgress = Async.ladyFirst();
                    $scope.$watch("userProgress", function(progress) {
                        if (progress) {
                            ladyUserProgress.ladyDone();
                        }
                    });

                    $scope.$watch(attrs.section, function(section) {
                        $scope.result = null;

                        ladyUserProgress.manTurn(function() {
                            var sectionNum = courseCtrl.sectionNum();
                            var progress = $scope.userProgress.sections[sectionNum - 1];
                            $scope.question = section.questions[progress];
                            
                            if (!$scope.$$phase) $scope.$digest();
                        });
                    });
                    //$scope.nextSection = function() {
                    //    courseCtrl.nextSection();
                    //};
                    $scope.sectionNum = function() {
                        return courseCtrl.sectionNum();
                    };

                    $scope.nextQuestion = function() {
                        $scope.result = null;

                        var indexOf = $scope.section.questions.indexOf($scope.question);
                        if (indexOf < $scope.section.questions.length - 1) {
                            $scope.question = $scope.section.questions[indexOf + 1];

                            // Update progress
                            var sectionNum = courseCtrl.sectionNum();
                            $scope.userProgress.sections[sectionNum - 1] = indexOf + 1;
                        } else {
                            // TODO
                            //return false;
                        }

                        return false;
                    };


                    $scope.progress = function() {
                        return $scope.section == null ? 0 : $scope.section.questions.indexOf($scope.question);
                    };

                },
                controller: function($scope) {
                    var ctrl = this;

                    ctrl.submitAnswer = function(answer) {

                        if (ObjectUtil.equals(answer, $scope.question.answer)) {
                            showResult(true, $scope.question.explanation);
                        } else {
                            showResult(false);
                        }

                        if (!$scope.$$phase) $scope.$digest();
                    };

                    var showResult = function(passed, explanation) {
                        $scope.result = passed == null ? null : {
                            passed: passed,
                            explanation: explanation
                        };
                    };
                }
            };
        })

    ;

})();