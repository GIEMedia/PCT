"use strict";

(function () {

    angular.module('pct.management.api.manufacturer', [
    ])
        .factory("ManufacturerService", ["Api", function(Api) {
            return {
                getList: function() {
                    return Api.get("api/manage/manufacturer");
                },
                add: function(name) {
                    return Api.put("api/manage/manufacturer", JSON.stringify(name));
                },
                setTitle: function(newName, id) {
                    return Api.put("api/manage/manufacturer/" + id, JSON.stringify(newName));
                },
                uploadImage: function(file, manufacturer_id) {
                    return Api.upload("api/manage/manufacturer/image/" + manufacturer_id, file);
                },
                remove: function(id) {
                    return Api.delete("api/manage/manufacturer/" + id);
                }
            };
        }])
    ;

})();