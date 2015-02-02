"use strict";

(function () {

    angular.module('pct.elearning.api.Account', [
    ])


        .factory("AccountService", function(Api) {
            return {
                createAccount: function(data) {
                    return Api.post("api/account/register", data);
                }
            };
        })
    ;

})();