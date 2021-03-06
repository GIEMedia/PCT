"use strict";

(function () {

    angular.module('pct.elearning.api.Account', [
    ])

        .factory("AccountService", ["$http", "Api", function($http, Api) {
            return {
                createAccount: function(data) {
                    return Api.post("api/account/register", data);
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
        }])
    ;

})();