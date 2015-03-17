"use strict";

(function () {

    angular.module('pct.management.api.category', [
    ])
        .factory("CategoryService", function(Api) {
            var category = {
                "sub_categories":[
                    {
                        "id":"a5907072-3129-4f68-9add-a4470133bfd8",
                        "title":"Sub Cat"
                    }
                ],
                "id":"27a5acd9-1229-472c-94a5-a4470133c00b",
                "title":"Main Cat"
            };


            return {
                getList: function() {
                    return Api.get("api/manage/course/categories");
                }
            };
        })
    ;

})();