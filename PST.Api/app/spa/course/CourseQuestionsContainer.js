"use strict";

(function () {

    angular.module('pct.elearning.course.questionsContainer', [
        'pct.elearning.course.question'
    ])

        /**
         * Move to the current question - based on progress.
         * Change question when answered correctly.
         */
        .directive("courseQuestionsContainer", ["CourseService", function(CourseService) {
            return {
                restrict: "C",
                require: "^course",
                scope: true,
                templateUrl: "/app/spa/course/CourseQuestionsContainer.html",
                link: function($scope, elem, attrs, courseCtrl) {

                    if ($scope.previewMode) {

                        // When section is changed, focus to the question
                        $scope.$watch(attrs.section, function(section) {

                            $scope.result = null;
                            $scope.question = null;

                            if (section == null) {
                                return;
                            }
                            $scope.question = section.questions[0];
                        });
                    } else {
                        var waitProgress = Async.ladyFirst();

                        $scope.$watch("progress", function(value) {
                            if (value) {
                                waitProgress.ladyDone();
                            }
                        });

                        // When section is changed, focus to the question
                        $scope.$watch(attrs.section, function(section) {

                            $scope.result = null;
                            $scope.question = null;

                            if (section == null) {
                                return;
                            }

                            waitProgress.manTurn(function() {
                                var sectionNum = courseCtrl.sectionNum();

                                var secProgress = $scope.progress[$scope.section.section_id];
                                secProgress = secProgress == null ? 0 : secProgress;
                                if (!(secProgress >= $scope.section.questions.length)) {
                                    $scope.question = section.questions[secProgress];

                                    if (!$scope.$$phase) $scope.$digest();
                                }
                            });
                        });
                    }

                    $scope.finishedThisSection = function() {
                        if ( $scope.section == null || $scope.progress == null) {
                            return false;
                        }
                        return $scope.progress[$scope.section.section_id] >= $scope.section.questions.length;
                    };

                    $scope.sectionNum = function() {
                        return courseCtrl.sectionNum();
                    };

                    // Move on to the next question
                    $scope.nextQuestion = function() {
                        $scope.result = null;

                        $scope.question.answered = true;

                        var indexOf = $scope.section.questions.indexOf($scope.question);
                        if (indexOf < $scope.section.questions.length - 1) {
                            $scope.question = $scope.section.questions[indexOf + 1];
                        } else if (!$scope.previewMode) {
                            $scope.question = null;
                        }

                        return false;
                    };

                    $scope.prevQuestion = function() {
                        var indexOf = $scope.section.questions.indexOf($scope.question);
                        if (indexOf == 0) {
                            return;
                        } else {
                            $scope.question = $scope.section.questions[indexOf - 1];
                        }
                    };

                    // Returns index of this question in the sequence of questions
                    $scope.questionIndex = function() {
                        return $scope.section == null ? 0 : $scope.section.questions.indexOf($scope.question);
                    };

                    // Bring the scroll to bottom of question panel when has question answer result.
                    var checkHasResult = function () {
                        // Has to check 2 levels because result.passed can also be null, which will affect hasResult != null
                        return $scope.result == null ? null : $scope.result.passed;
                    };
                    $scope.$watch(checkHasResult, function(hasResult) {
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
                controller: ["$scope", function($scope) {

                    var showResult = function(passed, correct_heading, correct_text) {
                        $scope.result = passed == null ? null : {
                            passed: passed,
                            correct_heading: correct_heading,
                            correct_text: correct_text
                        };
                    };

                    var ctrl = this;

                    ctrl.submitAnswer = function(answer) {
                        return CourseService.check($scope.question.question_id, $scope.course.course_id, answer).success(function(resp) {
                            // update the progress
                            if (resp.correct) {
                                var currentProgress = $scope.progress[$scope.section.section_id];
                                $scope.progress[$scope.section.section_id] = (currentProgress == null ? 0 : currentProgress) + 1;
                            }
                            showResult(resp.correct, resp.correct_response_heading, resp.correct_response_text);
                        });
                    };

                    ctrl.answerChanged = function() {
                        if ($scope.result != null && !$scope.result.passed) {
                            $scope.result = null;
                            if (!$scope.$$phase) $scope.$digest();
                        }
                    };

                }]
            };
        }])

    ;

})();