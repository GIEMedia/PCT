"use strict";

(function () {

    angular.module('pct.management.courseEdit.reviewInvite', [
    ])

        .config(["$stateProvider", function ($stateProvider) {
            $stateProvider
                .state('courseEdit.reviewInvite', {
                    url: '/reviewInvite',
                    templateUrl: "Areas/Management/app/spa/course_edit/review_invite/ReviewInvite.html",
                    controller: "courseEdit.reviewInvite.Ctrl"
                })
            ;
        }])

        .controller("courseEdit.reviewInvite.Ctrl", ["$scope", "$stateParams", "StateService", "CourseService", "ReviewService", function ($scope, $stateParams, StateService, CourseService, ReviewService) {
            $scope.setCel({
                step: 3,
                canGoForward: function() {
                    return ($scope.course!=null && $scope.course.status == 1) || $scope.ri.valid;
                }
            });

            $scope.states = StateService.getStates();

            $scope.reviewer = {};

            $scope.ri = {
                sending: false,
                valid: false
            };

            $scope.send = function() {
                $scope.ri.sending = true;
                CourseService.review($stateParams.courseId, $scope.reviewer).success(function() {
                    if ($scope.course.status == 0) {
                        $scope.course.status = 2;
                    }
                }).then(function() {
                    $scope.ri.sending = false;
                });
            };

            $scope.reviewCourse = function() {
                window.open(ReviewService.getReviewCourseUrl($stateParams.courseId), "_blank");
            };
            $scope.reviewTest = function() {
                window.open(ReviewService.getReviewTestUrl($stateParams.courseId), "_blank");
            };

        }])

        .directive("courseValidation", ["$state", "CourseService", function($state, CourseService) {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    course: "=",
                    valid: "="
                },
                templateUrl: "Areas/Management/app/spa/course_edit/review_invite/CourseValidation.html",
                link: function($scope, elem, attrs) {

                    $scope.$watch("course", function(course) {
                        if (course) {
                            CourseService.validate(course.id).success(function(validation) {
                                $scope.validation = validation;
                                $scope.valid = Cols.isEmpty(Cols.filter(validation, function(p) { return p.severity == 3; }));
                            });
                        }
                    });

                    $scope.toProblem = function(problem) {
                        if (!problem.question_id) {
                            if (!problem.no_questions) {
                                $state.go("courseEdit.sections.list");
                            } else {
                                if (!problem.section_id) {
                                    $state.go("courseEdit.test");
                                } else {
                                    $state.go("courseEdit.sections.detail", {
                                        sectionId: problem.section_id
                                    });
                                }
                            }
                        } else {
                            if (!problem.section_id) {
                                $state.go("courseEdit.test", {
                                    focusQuestion: problem.question_id
                                });
                            } else {
                                $state.go("courseEdit.sections.detail", {
                                    sectionId: problem.section_id,
                                    focusQuestion: problem.question_id
                                });
                            }
                        }
                    };

                    $scope.dismiss = function(problem) {
                        Cols.remove(problem, $scope.validation);
                    };

                }
            };
        }])

        .provider("ReviewService", function() {
            var _courseReviewTmpl;
            var _testReviewTmpl;

            this.setReviewUrl = function(courseReviewTmpl, testReviewTmpl) {
                _courseReviewTmpl = courseReviewTmpl;
                _testReviewTmpl = testReviewTmpl;
            };

            this.$get = function() {
                return {
                    getReviewCourseUrl : function(courseId) {
                        return _courseReviewTmpl.replace("{courseId}", courseId);
                    },
                    getReviewTestUrl : function(courseId) {
                        return _testReviewTmpl.replace("{courseId}", courseId);
                    }
                };
            };
        })
    ;

})();