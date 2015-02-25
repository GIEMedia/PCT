"use strict";

(function () {

    angular.module('pct.elearning.landing', [
            'ui.router'
    ])
    
        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('landing', {
                    url: '/landing',
                    templateUrl: "/app/spa/landing/Landing.html",
                    controller: "landing.Ctrl"
                })
            ;
        }])

        .controller("landing.Ctrl", ["$scope", function ($scope) {

        }])

        .directive("eIntroduction", function() {
            return {
                restrict: "E",
                templateUrl: "/app/spa/landing/eIntroduction.html",
                link: function($scope, elem, attrs) {
                }
            };
        })
    ;

})();