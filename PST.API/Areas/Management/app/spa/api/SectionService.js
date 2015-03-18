"use strict";

(function () {

    angular.module('pct.management.api.section', [
    ])
        .factory("SectionService", function(Api) {

            return {
                getList: function(courseId) {
                    return Api.get("api/manage/course/section/list/" + courseId);
                }
            };
        })
    ;

})();