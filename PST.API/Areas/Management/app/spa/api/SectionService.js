"use strict";

(function () {

    angular.module('pct.management.api.section', [
    ])
        .factory("SectionService", function(Api) {
            var sample = {
                "id": "97901e52-eaab-49ac-ba04-a460010621f5",
                "title": "Section 2",
                "num_questions": 2,
                "document": {
                    "pdf_url": "app/temp/sample.pdf",
                    "pages": ["app/css/images/temp/pdf-placeholder1.jpg", "app/css/images/temp/pdf-placeholder2.jpg"]
                }
            };

            return {
                getList: function(courseId) {
                    return Api.get("api/manage/course/section/list/" + courseId);
                },
                setTitle: function(newTitle, courseID, sectionID) {
                    return Api.put("api/manage/course/section/rename/" + courseID + "/" + sectionID, JSON.stringify(newTitle));
                },
                upsert: function(section, courseID) {
                    return Api.put("api/manage/course/section/" + courseID, section);
                },
                setOrder: function(order, courseID) {
                    //order = [
                    //    "1d81d18e-174c-4323-935b-ff41db4e18ac",
                    //    "67cf4733-801b-4c48-9b57-fdaa06cc0686",
                    //    "3e1fde52-960b-4302-bf12-eb9bcf0ee94f"
                    //]
                    return Api.put("api/manage/course/section/sort/" + courseID, order);
                },
                delete: function(courseID, sectionID) {
                    return Api.delete("api/manage/course/section/" + courseID + "/" + sectionID);
                }
            };
        })
    ;

})();