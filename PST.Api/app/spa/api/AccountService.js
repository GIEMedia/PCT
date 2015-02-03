"use strict";

(function () {

    angular.module('pct.elearning.api.Account', [
    ])


        .factory("AccountService", function($http) {
            return {
                createAccount: function(data) {
                    return $http.post("api/account/register", data);
                }
            };
        })
    ;

})();