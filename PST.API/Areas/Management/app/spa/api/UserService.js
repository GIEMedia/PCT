"use strict";

(function () {

    angular.module('pct.management.api.user', [
    ])
        .factory("UserService", ['Api', function(Api) {

            return {
                getList: function(page) {
                    return Api.get("api/manage/user/list?page=" + page + "&qty=20"); // ?page=1&qty=20&search=a
                },
                getDetail: function(userId) {
                    return Api.get("api/manage/user/" + userId);
                },
                search: function(text) {
                    return Api.get("api/manage/user/search?search=" + text);
                },
                setAdminAccess: function(userId, adminAccess) {
                    return Api.put("api/manage/user/admin/" + userId + "?access=" + adminAccess);
                }
            };
        }])
    ;
})();