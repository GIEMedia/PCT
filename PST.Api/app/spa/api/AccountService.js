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
                },
                updateAccount: function(account) {
                    return Api.put("api/account", account);
                },
                changePassword: function(change_passwordForm) {
                    return Api.post("api/account/change_password", change_passwordForm);
                }
            };
        })
    ;

})();