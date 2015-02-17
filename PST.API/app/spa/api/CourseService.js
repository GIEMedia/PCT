"use strict";

(function () {

    angular.module('pct.elearning.api.Course', [
        'pct.elearning.mock.data.Course'
    ])
        .factory("CourseService", function($timeout, CourseMockData, UserCourseService, Api) {
            var CourseService = {};

            CourseService.check = function(questionId, answer, callback) {
                if (questionId == "902c059c-adf9-47c6-957f-80b283dcd913" && equalSet(answer, ["902c059c-adf9-47c6-957f-80b283dcd913"])) {
                    callback(true, "This product is labeled to treat carpenter ants, German cockroaches and silverfish, but it is NOT labeled for treating bed bugs.");
                } else if (questionId == "16ef5514-059a-4490-a3ac-a43202bd2a21" && equalSet(answer, ["1380e8ac-d486-464c-8197-9a1b5fbcc9a3"])) {
                    callback(true, "When you read the list of target pests at the top of the label, it specifically lists four types of ants but little black ants is not one of them. On some labels, it will say \"Ants, including...\" and provide a number of common species, but this label is specific to only four types of ants.");
                } else if (questionId == "1380e8ac-d486-464c-8197-9a1b5fbcc9a3" && equalSet(answer, ["902c059c-adf9-47c6-957f-80b283dcd913"])) {
                    callback(true, "The image is of a carpenter ant.");
                } else if (questionId == "cba92dd2-47f0-4171-b0f5-2923dba347a3" && equalSet(answer, ["912eac82-b76d-4e49-8c6d-05a91e44f946"])) {
                    callback(true, "This product contains 0.1% of the active ingredient, Pestothrin.");
                } else {
                    callback(false);
                }
            };

            CourseService.get = function(id) {
                return Api.get("api/course/" + id);
            };

            CourseService.getNewCourses = function() {
                return Api.get("api/course/new");
            };

            CourseService.getOpenCourses = function() {
                return CourseMockData.openCourses;
            };
            CourseService.getCourseStructure = function() {
                return Api.get("api/course/list");
            };


            return CourseService;
        })

    ;

})();