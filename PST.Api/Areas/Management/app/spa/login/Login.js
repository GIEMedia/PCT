"use strict";

(function () {

    angular.module('pct.management.login', [
            'ui.router'
    ])
    
        .config(function ($stateProvider) {

            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: "/Areas/Management/app/spa/login/Login.html",
                    data: {
                        name: "Login"
                    },
                    controller: "login.Ctrl"
                })
            ;
        })

        .controller("login.Ctrl", function ($scope, $state, User) {
            $scope.login = function() {
                User.loggedIn = true;
                User.fullName = "dave.hurt";

                $state.go("courses");
            };
        })

    ;

})();