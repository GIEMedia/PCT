"use strict";

(function () {

    angular.module('pct.management.api.user', [
    ])
        .factory("UserService", function(Api) {

            return {
                getList: function() {
                    return Api.get("api/manage/user/list"); // ?page=1&qty=20&search=a
                },
                search: function(text) {
                    return Api.get("api/manage/user/search?search=" + text);
                }
            };
        })
    ;

})();