"use strict";

(function () {

    angular.module('pct.elearning.api.StateLicensure', [
    ])
        .factory("StateLicensureService", function(Api) {

            return {
                get : function() {
                    return Api.get("api/account/licensures");
                },
                send : function(courseId, licensures) {
                    return Api.put("api/test/send/licensure/" + courseId, licensures);
                }
            };
        })
    ;

})();