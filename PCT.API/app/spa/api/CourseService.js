"use strict";

(function () {

    angular.module('pct.elearning.api.Course', [
    ])
        .factory("CourseService", ["$timeout", "Api", "$q", function($timeout, Api, $q) {
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
                getPreview : function(id, token) {
                    return Api.get("api/course/" + id + "/preview" + (token ? "?token=" + token : ""));
                },
                getProgress : function(id) {
                    return Api.get("api/account/progress/course/" + id).then(function(resp) {
                        var defer = $q.defer();
                        var progressCourse = {
                            progress: {},
                            config: resp.data
                        };
                        for (var i = 0; i < resp.data.sections.length; i++) {
                            var sec = resp.data.sections[i];
                            if (sec.correctly_answered_questions != null) {
                                progressCourse.progress[sec.section_id] = sec.correctly_answered_questions.length;
                            }
                        }

                        defer.resolve(progressCourse);
                        return defer.promise;
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
                },
                verifyStatement: function (courseId, initials) {
                    return Api.put("api/course/verify/" + courseId, JSON.stringify(initials));
                },
                getCertificationCategories: function () {
                    return Api.get("api/account/certification_category");
                },
                incrementCourseActivity: function (courseId, elapsedSeconds) {
                    return Api.put("api/course/activity/" + courseId, elapsedSeconds);
                },
                retakeCourse: function (courseId) {
                    return Api.post("api/course/retake/" + courseId);
                }
            };
        }])

    ;

})();