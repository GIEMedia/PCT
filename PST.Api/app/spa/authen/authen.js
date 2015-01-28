"use strict";

(function () {

    angular.module('pct.elearning.authen', [
    ])
        .factory("User", function() {
            //return {
            //    loggedIn: false
            //};
            return {
                loggedIn: true,
                firstName: "David",
                fullName: "David Hurt"
            };
        })

        .run(function($rootScope, User) {
            $rootScope.User = User;
        })
    ;

})();