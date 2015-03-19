"use strict";

(function () {

    angular.module('pct.management.api.question', [
    ])
        .factory("QuestionService", function(Api) {
            var sample= {};

            return {
                getList: function(courseId, sectionId) {
                    return Api.get("api/manage/course/question/list/" + courseId + "/" + sectionId);
                }
            };
        })
    ;

})();