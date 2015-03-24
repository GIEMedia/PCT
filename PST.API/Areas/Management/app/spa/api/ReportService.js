"use strict";

(function () {

    angular.module('pct.management.api.report', [
    ])
        .factory("ReportService", ['Api', function(Api) {
            return {
                getResult: function(courseId) {
                    return Api.get("api/manage/results/" + courseId);
                }
            };
        }])
    ;
})();