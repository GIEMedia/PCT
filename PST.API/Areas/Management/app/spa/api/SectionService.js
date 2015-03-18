"use strict";

(function () {

    angular.module('pct.management.api.section', [
    ])
        .factory("SectionService", function(Api) {

            return {
                getList: function(courseId) {
                    return Api.get("api/manage/course/section/list/" + courseId);
                },
                setTitle: function(newTitle, courseID, sectionID) {
                    return Api.put("api/manage/course/section/rename/" + courseID + "/" + sectionID, JSON.stringify(newTitle));
                }
            };
        })
    ;

})();