"use strict";

(function () {

    angular.module('pct.elearning.landing', [
            'ui.router'
    ])
    
        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('landing', {
                    url: '/landing',
                    templateUrl: "/app/spa/landing/Landing.html?v=" + htmlVer,
                    controller: "landing.Ctrl"
                })
            ;
        }])


        .controller("landing.Ctrl", ["$scope", "$state", "User", function ($scope, $state, User) {
            if (User.loggedIn) {
                $state.go("dashboard");
            }
        }])


        .directive("eIntroduction", function() {
            return {
                restrict: "E",
                templateUrl: "/app/spa/landing/eIntroduction.html"
            };
        })
    ;

})();