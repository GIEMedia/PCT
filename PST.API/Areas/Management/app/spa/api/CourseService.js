"use strict";

(function () {

    angular.module('pct.management.api.course', [
    ])
        .factory("CourseService", ["Api", function(Api) {

            // Sample data
            var course = {
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
                review: function(courseId, reviewer) {
                    //{
                    //    "name": "sample string 1",
                    //    "state": "sample string 2",
                    //    "email": "someone@somewhere.com"
                    //}
                    return Api.put("api/manage/course/review/" + courseId, reviewer);
                }
            };
        }])
    ;
})();