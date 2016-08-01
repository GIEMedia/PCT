"use strict";

(function () {

    angular.module('pct.elearning.course.questions-viewer', [
        'pct.elearning.course.question'
    ])

        /**
         * Move to the current question - based on progress.
         * Change question when answered correctly.
         */
        .directive("courseQuestionsViewer", function() {
            return {
                restrict: "E",
                scope: {
                    course: "=",
                    progressCourse: "=",
                    section: "=",
                    previewMode: "=",
                    onChangeSection: "&",
                    onFinishAll: "&",
                    letControl: "=control"
                },
                templateUrl: "/app/spa/course/questions-viewer/questions-viewer.html?v=" + htmlVer,
                link: function($scope, elem, attrs) {


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
                controller: ["$scope", "CourseService", "$state", "$q", function($scope, CourseService, $state, $q) {

                    $scope.progressPercent = function () {
                        var percent = 0;

                        for (var i = 0; i < $scope.course.sections.length; i++) {
                            var sec = $scope.course.sections[i];
                            if (!($scope.progress[sec.section_id] != sec.questions.length)) {
                                percent++;
                            }
                        }
                        return percent/$scope.course.sections.length * 100;
                    };

                    $scope.view = {
                        questionControl: null
                    };

                    $scope.nextUnfinishedSection = function() {
                        for (var i = 0; i < $scope.course.sections.length; i++) {
                            var sec = $scope.course.sections[i];
                            var secProgress = $scope.progress[sec.section_id];
                            if (secProgress == null || secProgress < sec.questions.length) {
                                return $scope.course.sections[i];
                            }
                        }
                    };

                    if (!$scope.previewMode) {
                        CourseService.getProgress($scope.course.course_id).then(function(resp) {
                            $scope.progress = resp.progress;
                            var section = $scope.nextUnfinishedSection();
                            $scope.onChangeSection({$value: section || $scope.course.sections[0] });
                        });

                    } else {
                        $scope.progress = {};
                        $scope.onChangeSection({$value: $scope.course.sections[0] });
                    }

                    $scope.sectionNum = function() {
                        return $scope.course ==null ? 0 : $scope.course.sections.indexOf($scope.section) + 1;
                    };

                    // Section query
                    $scope.finishedAllSection = function() {
                        if ($scope.course == null || $scope.progress == null) {
                            return false;
                        }

                        for (var i = 0; i < $scope.course.sections.length; i++) {
                            var sec = $scope.course.sections[i];
                            var secProgress = $scope.progress[sec.section_id];
                            if (secProgress == null || secProgress < sec.questions.length) {
                                return false;
                            }
                        }
                        return true;
                    };

                    $scope.letControl = {
                        isComplete: function(section) {
                            return $scope.progress == null ? false : $scope.progress[section.section_id] >= section.questions.length;
                        }
                    };
                    $scope.gotoTest = function() {
                        $state.go('test',{courseId: $scope.course.course_id});
                    };


                    $scope.$watch("progress && section", function(value) {
                        if (value) {
                            $scope.result = null;
                            $scope.question = null;

                            var secProgress = $scope.progress[$scope.section.section_id] || 0;
                            $scope.question = $scope.section.questions[Math.min(secProgress, $scope.section.questions.length)];
                        }
                    });

                    $scope.finishedThisSection = function() {
                        if ( $scope.section == null || $scope.progress == null) {
                            return false;
                        }
                        return $scope.progress[$scope.section.section_id] >= $scope.section.questions.length;
                    };

                    // Move on to the next question
                    $scope.nextQuestion = function() {
                        $scope.result = null;

                        $scope.question.answered = true;

                        var indexOf = $scope.section.questions.indexOf($scope.question);
                        if (indexOf < $scope.section.questions.length - 1) {
                            $scope.question = $scope.section.questions[indexOf + 1];
                        } else {
                            $scope.question = null;
                        }

                        return false;
                    };

                    $scope.prevQuestion = function() {
                        var indexOf = $scope.section.questions.indexOf($scope.question);
                        $scope.question = $scope.section.questions[indexOf - 1];
                    };

                    // Returns index of this question in the sequence of questions
                    $scope.questionIndex = function() {
                        return $scope.section == null ? 0 : $scope.section.questions.indexOf($scope.question);
                    };

                    $scope.checkAnswer = function(question_id, answer) {
                        return CourseService.check(question_id, $scope.course.course_id, answer).then(function(resp) { return resp.data; });
                    };

                    $scope.progressQuestion = function() {
                        var currentProgress = $scope.progress[$scope.section.section_id];
                        $scope.progress[$scope.section.section_id] = (currentProgress == null ? 0 : currentProgress) + 1;

                        if ($scope.finishedAllSection()) {
                            $scope.onFinishAll();
                        }
                    };

                }]
            };
        })

    ;

})();