"use strict";

(function () {

    angular.module('pct.elearning.course.questionsContainer', [
        'pct.elearning.course.question'
    ])

        .directive("courseQuestionsContainer", function(CourseService) {
            return {
                restrict: "C",
                require: "^course",
                scope: true,
                templateUrl: "/app/spa/course/CourseQuestionsContainer.html",
                link: function($scope, elem, attrs, courseCtrl) {

                    // When section is changed, focus to the question
                    $scope.$watch(attrs.section, function(section) {
                        $scope.result = null;
                        $scope.question = null;

                        var sectionNum = courseCtrl.sectionNum();

                        if (!section.complete) {
                            for (var i = 0; i < section.questions.length; i++) {
                                var question = section.questions[i];
                                if (!question.answered) {
                                    $scope.question = question;
                                    break;
                                }
                            }

                            if (!$scope.$$phase) $scope.$digest();
                        }
                    });

                    $scope.finishedThisSection = function() {
                        if ( $scope.course == null) {
                            return false;
                        }

                        return $scope.section.complete;
                    };

                    $scope.finishedAllSection = function() {
                        return courseCtrl.finishedAllSection();
                    };

                    // Change to next unfinished section
                    $scope.nextUnfinishedSection = function() {
                        courseCtrl.nextUnfinishedSection();
                    };

                    $scope.sectionNum = function() {
                        return courseCtrl.sectionNum();
                    };

                    // Move on to the next question, update the progress
                    $scope.nextQuestion = function() {
                        $scope.result = null;

                        $scope.question.answered = true;

                        var indexOf = $scope.section.questions.indexOf($scope.question);
                        if (indexOf < $scope.section.questions.length - 1) {
                            $scope.question = $scope.section.questions[indexOf + 1];
                        } else {
                            $scope.question = null;
                            $scope.section.complete = true;
                        }

                        return false;
                    };

                    // Returns index of this question in the sequence of questions
                    $scope.progress = function() {
                        return $scope.section == null ? 0 : $scope.section.questions.indexOf($scope.question);
                    };

                    // Bring the scroll to bottom of question panel when has result.
                    $scope.$watch(function() { return $scope.result == null ? null : $scope.result.passed;}, function(hasResult) {
                        if (hasResult != null) {
                            //console.log("Scrolling");
                            setTimeout(function() {
                                elem.animate({
                                    scrollTop: elem.find('.course-question-answer').position().top
                                }, 200);
                            }, 0);

                        }

                    });
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
                        CourseService.check($scope.question.question_id, answer, function(correct, explanation) {
                            if (correct) {
                                showResult(true, explanation);
                            } else {
                                showResult(false);
                            }
                        });
                    };

                }
            };
        })

    ;

})();