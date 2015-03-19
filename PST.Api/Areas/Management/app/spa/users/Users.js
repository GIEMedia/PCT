"use strict";

(function () {

    angular.module('pct.management.users', [
    ])
        .config(function ($stateProvider) {

            $stateProvider
                .state('users', {
                    url: '/users',
                    templateUrl: "/Areas/Management/app/spa/users/Users.html",
                    data: {
                        name: "Users"
                    },
                    controller: "users.Ctrl"
                })
            ;
        })

        .controller("users.Ctrl", function ($scope, LayoutService) {
            LayoutService.supportSearch($scope, {
                placeholder: "Search"
            });
        })
    ;

})();