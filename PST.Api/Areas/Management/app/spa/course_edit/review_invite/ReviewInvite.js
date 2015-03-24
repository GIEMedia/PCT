"use strict";

(function () {

    angular.module('pct.management.courseEdit.reviewInvite', [
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.reviewInvite', {
                    url: '/reviewInvite',
                    templateUrl: "Areas/Management/app/spa/course_edit/review_invite/ReviewInvite.html",
                    controller: "courseEdit.reviewInvite.Ctrl"
                })
            ;
        })

        .controller("courseEdit.reviewInvite.Ctrl", function ($scope, $stateParams, StateService, CourseService, ReviewService) {
            $scope.setCel({
                step: 3
            });

            $scope.states = StateService.getStates();

            $scope.reviewer = {};

            $scope.send = function() {
                CourseService.review($stateParams.courseId, $scope.reviewer).success(function() {
                    if ($scope.course.status == 0) {
                        $scope.course.status = 2;
                    }
                });
            };

            $scope.reviewCourse = function() {
                window.open(ReviewService.getReviewCourseUrl($stateParams.courseId), "_blank");
            };
            $scope.reviewTest = function() {
                window.open(ReviewService.getReviewTestUrl($stateParams.courseId), "_blank");
            };
        })

        .factory("ReviewService", function() {
            var _courseReviewTmpl;
            var _testReviewTmpl;
            return {
                getReviewCourseUrl: function(courseId) {
                    return _courseReviewTmpl.replace("{courseId}", courseId);
                },
                getReviewTestUrl: function(courseId) {
                    return _testReviewTmpl.replace("{courseId}", courseId);
                },
                setReviewUrl: function(courseReviewTmpl, testReviewTmpl) {
                    _courseReviewTmpl = courseReviewTmpl
                    _testReviewTmpl = testReviewTmpl;
                }
            };
        })
    ;

})();