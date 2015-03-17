"use strict";

(function () {

    angular.module('pct.management.course', [
    ])
        .factory("CourseService", function(Api) {
            return {
                getList: function() {
                    return Api.get("api/manage/course/list");
                }
            };
        })
    ;

})();