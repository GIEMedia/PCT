"use strict";

(function () {

    angular.module('pct.elearning.course.questionsContainer', [
        'pct.elearning.course.question'
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
                        $scope.question = null;

                        ladyUserProgress.manTurn(function() {
                            var sectionNum = courseCtrl.sectionNum();
                            var progress = $scope.userProgress.sections[sectionNum - 1];

                            if (progress < section.questions.length) {
                                $scope.question = section.questions[progress];

                                if (!$scope.$$phase) $scope.$digest();
                            }
                        });
                    });

                    $scope.finishedThisSection = function() {
                        if ($scope.userProgress == null || $scope.course == null) {
                            return false;
                        }

                        var sectionNum = courseCtrl.sectionNum();
                        var progress = $scope.userProgress.sections[sectionNum - 1];
                        return progress >= $scope.section.questions.length;
                    };

                    $scope.finishedAllSection = function() {
                        if ($scope.userProgress == null || $scope.course == null) {
                            return false;
                        }

                        for (var i = 0; i < $scope.course.sections.length; i++) {
                            var sec = $scope.course.sections[i];
                            var progress = $scope.userProgress.sections[i];
                            if (progress == null || progress < sec.questions.length) {
                                return false;
                            }
                        }
                        return true;
                    };

                    $scope.nextUnfinishedSection = function() {
                        for (var i = 0; i < $scope.course.sections.length; i++) {
                            var sec = $scope.course.sections[i];
                            var progress = $scope.userProgress.sections[i];
                            if (progress == null || progress < sec.questions.length) {
                                courseCtrl.gotoSection(i+1);
                                return;
                            }
                        }
                    };

                    $scope.sectionNum = function() {
                        return courseCtrl.sectionNum();
                    };

                    $scope.nextQuestion = function() {
                        $scope.result = null;

                        var indexOf = $scope.section.questions.indexOf($scope.question);
                        if (indexOf < $scope.section.questions.length - 1) {
                            $scope.question = $scope.section.questions[indexOf + 1];

                        } else {
                            $scope.question = null;
                        }

                        // Update progress
                        var sectionNum = courseCtrl.sectionNum();
                        $scope.userProgress.sections[sectionNum - 1] = indexOf + 1;

                        return false;
                    };

                    $scope.progress = function() {
                        return $scope.section == null ? 0 : $scope.section.questions.indexOf($scope.question);
                    };

                },
                controller: function($scope) {

                    var showResult = function(passed, explanation) {
                        $scope.result = passed == null ? null : {
                            passed: passed,
                            explanation: explanation
                        };
                    };

                    var ctrl = this;

                    ctrl.submitAnswer = function(answer) {

                        if (ObjectUtil.equals(answer, $scope.question.answer)) {
                            showResult(true, $scope.question.explanation);
                        } else {
                            showResult(false);
                        }

                        if (!$scope.$$phase) $scope.$digest();
                    };

                }
            };
        })

    ;

})();