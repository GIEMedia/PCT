"use strict";

(function () {

    angular.module('pct.elearning.api.Course', [
    ])
        .factory("CourseService", ["$timeout", "Api", function($timeout, Api) {
            return {
                check : function(questionId, courseId, answer) {
                    return Api.put("api/course/answer/" + courseId, {
                        question_id: questionId,
                        selected_option_ids: answer
                    });
                },
                get : function(id) {
                    return Api.get("api/course/" + id);
                },
                getProgress : function(id, callback) {
                    return Api.get("api/account/progress/course/" + id).success(function(resp) {
                        var progress = {};
                        for (var i = 0; i < resp.sections.length; i++) {
                            var sec = resp.sections[i];
                            progress[sec.section_id] = sec.complete ? sec.correctly_answered_questions.length : 0;
                        }
                        callback(progress);
                    });
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
        }])

    ;

})();