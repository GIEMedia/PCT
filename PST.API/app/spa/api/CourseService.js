"use strict";

(function () {

    angular.module('pct.elearning.api.Course', [
    ])
        .factory("CourseService", function($timeout, Api) {
            return {
                check : function(questionId, courseId, answer) {
                    return Api.put("api/course/answer/" + courseId + "/" + questionId, answer);
                },
                get : function(id) {
                    return Api.get("api/course/" + id);
                },
                getNewCourses : function() {
                    return Api.get("api/course/new");
                },
                getOpenCourses : function() {
                    return Api.get("api/account/courses");
                },
                getCourseStructure : function() {
                    return Api.get("api/course/list");
                }
            };
        })

    ;

})();