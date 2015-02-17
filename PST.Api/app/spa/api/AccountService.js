"use strict";

(function () {

    angular.module('pct.elearning.api.Account', [
    ])

        .factory("AccountService", function($http, Api) {
            return {
                createAccount: function(data) {
                    return $http.post("api/account/register", data);
                },
                getAccount: function() {
                    return Api.get("api/account");
                }
            };
        })
    ;

})();