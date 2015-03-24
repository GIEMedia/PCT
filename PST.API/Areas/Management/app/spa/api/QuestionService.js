"use strict";

(function () {

    angular.module('pct.management.api.question', [
    ])
        .factory("QuestionService", ["Api", function(Api) {

            var isEmpty = function(question) {
                return StringUtil.isBlank(question.question_text)
                    && StringUtil.isBlank(question.response_heading)
                    && StringUtil.isBlank(question.response_message)
                    && StringUtil.isBlank(question.tip)
                    && Cols.isEmpty(question.options);
            };

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
                    questions = Cols.filter(questions, function(q) { return !isEmpty(q); });
                    return Api.put("api/manage/course/question/" + courseId + "/" + sectionId, questions);
                },
                uploadImage: function(file) {
                    //return Api.upload("api/manage/course/question/image?width=73&height=73", file);
                    return Api.upload("api/manage/course/question/image?width=800&height=700", file);
                },
                uploadQuestionImage: function(file) {
                    return Api.upload("api/manage/course/question/image?width=800&height=700", file);
                },
                isEmpty: isEmpty
            };
        }])
    ;
})();