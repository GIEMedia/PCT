"use strict";

(function () {

    angular.module('pct.management.api.report', [
    ])
        .factory("ReportService", function(Api) {
            return {
                getResult: function(courseId) {
                    //return {success: function(func) {
                    //    func(
                    //        [
                    //            {
                    //                "question": "sample string 1",
                    //                "first_attempt": 2.0,
                    //                "second_attempt": 3.0,
                    //                "third_attempt": 4.0
                    //            },
                    //            {
                    //                "question": "sample string 1",
                    //                "first_attempt": 2.0,
                    //                "second_attempt": 3.0,
                    //                "third_attempt": 4.0
                    //            },
                    //            {
                    //                "question": "sample string 1",
                    //                "first_attempt": 2.0,
                    //                "second_attempt": 3.0,
                    //                "third_attempt": 4.0
                    //            }
                    //        ]);
                    //}};


                    return Api.get("api/manage/results/" + courseId);
                }
            };
        })
    ;

})();