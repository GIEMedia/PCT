"use strict";

(function () {

    angular.module('pct.elearning.authen', [
    ])
        .factory("User", function() {
            return {
                loggedIn: false,
                firstName: null,
                fullName: null
            };
        })
    ;

})();