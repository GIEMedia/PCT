"use strict";

(function () {

    angular.module('pct.management.api.category', [
    ])
        .factory("CategoryService", ["Api", function(Api) {
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
                getList: function(courseCount) {
                    return Api.get("api/manage/course/categories" + (courseCount ? "?courseCount=" + courseCount : ""));
                },
                addCategory: function(catName) {
                    return Api.put("api/manage/course/category", JSON.stringify(catName));
                },
                addSubCategory: function(parentId, catName) {
                    return Api.put("api/manage/course/category?parentCategoryID=" + parentId, JSON.stringify(catName));
                },
                setCatTitle: function(catName, catId) {
                    return Api.put("api/manage/course/category?categoryID=" + catId, JSON.stringify(catName));
                },
                setSubCatTitle: function(catName, catId, parentId) {
                    return Api.put("api/manage/course/category?categoryID=" + catId + "&parentCategoryID=" + parentId, JSON.stringify(catName));
                },
                deleteCategory: function(catId) {
                    return Api.delete("api/manage/course/category?categoryID=" + catId);
                },
                deleteSubCategory: function(catId, parentId) {
                    return Api.delete("api/manage/course/category?categoryID=" + catId + "&parentCategoryID=" + parentId);
                }
            };
        }])
    ;
})();