"use strict";

(function () {

    angular.module('pct.management.api.course', [
    ])
        .factory("CourseService", ["Api", function(Api) {

            // Sample data
            var courseSample = {
                "id":"9c1b5762-e5a4-485b-8e89-a4470133c024",
                "title":"Test Course 1",
                "date_created":"2015-02-22T23:40:29Z",
                "status":1,
                "category":"27a5acd9-1229-472c-94a5-a4470133c00b",
                "sub_category":"a5907072-3129-4f68-9add-a4470133bfd8",
                "state_ceus":[
                    {
                        "id":"6c4a4dd1-1263-4f0d-a4f7-a4470133c028",
                        "state":"OH",
                        "category_code":"a",
                        "hours":1.00000
                    }
                ]
            };
            //GET /api/course/validate/{courseID}
            //PUT /api/course/status/{courseID}/{courseStatus}
            return {
                getList: function() {
                    return Api.get("api/manage/course/list");
                },
                get: function(id) {
                    return Api.get("api/manage/course/" + id);
                },
                delete: function(course) {
                    return Api.delete("api/manage/course/" + course.id);
                },
                upsert: function(course) {
                    return Api.put("api/manage/course", course);
                },
                setStatus: function(courseId, status) {
                    return Api.put("api/manage/course/status/" + courseId + "/" + status);
                },
                validate: function(courseId) {
                    return Api.get("api/manage/course/validate/" + courseId);
                },
                review: function(courseId, reviewer) {
                    return Api.put("api/manage/course/review/" + courseId, reviewer);
                },
                getCertificationCategories: function () {
                    return Api.get("api/manage/certification_category");
                },
                deleteCertificationCategory: function (id) {
                    return Api.delete("api/manage/certification_category/" + id);
                },
                upsertCertificationCategory: function (certification) {
                    return Api.put("api/manage/certification_category", certification);
                }
            };
        }])
    ;
})();