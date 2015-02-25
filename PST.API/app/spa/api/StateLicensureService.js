"use strict";

(function () {

    angular.module('pct.elearning.api.StateLicensure', [
    ])
        .factory("StateLicensureService", ["Api", function(Api) {

            return {
                get : function() {
                    return Api.get("api/account/licensures");
                },
                update: function(licensures) {
                    return Api.put("api/account/licensures", licensures);
                },
                send : function(courseId, licensures) {
                    return Api.put("api/test/send/licensure/" + courseId, licensures);
                }
            };
        }])
    ;

})();