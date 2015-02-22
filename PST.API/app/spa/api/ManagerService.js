"use strict";

(function () {

    angular.module('pct.elearning.api.Manager', [
    ])
        .factory("ManagerService", function(Api) {

            return {
                get : function() {
                    return Api.get("api/account/managers");
                },
                update: function(managers) {
                    return Api.put("api/account/managers", managers);
                },
                send : function(courseId, managers) {
                    return Api.put("api/test/send/certificate/" + courseId, managers);
                }
            };
        })
    ;

})();