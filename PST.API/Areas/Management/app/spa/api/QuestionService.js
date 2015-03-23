"use strict";

(function () {

    angular.module('pct.management.api.question', [
    ])
        .factory("QuestionService", function(Api) {
            var sample= {};

            return {
                getList: function(courseId, sectionId) {
                    if (sectionId==null) {
                        sectionId = "";
                    }
                    return Api.get("api/manage/course/question/list/" + courseId + "/" + sectionId);
                },
                upsert: function(courseId, sectionId, questions) {
                    if (sectionId==null) {
                        sectionId = "";
                    }
                    return Api.put("api/manage/course/question/" + courseId + "/" + sectionId, questions);
                },
                uploadImage: function(file) {
                    //return Api.upload("api/manage/course/question/image?width=73&height=73", file);
                    return Api.upload("api/manage/course/question/image?width=800&height=700", file);
                },
                uploadQuestionImage: function(file) {
                    return Api.upload("api/manage/course/question/image?width=800&height=700", file);
                }
            };
        })
    ;

})();