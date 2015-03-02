"use strict";

(function () {

    angular.module('pct.elearning.landing', [
            'ui.router'
    ])
    
        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('landing', {
                    url: '/landing',
                    templateUrl: "/app/spa/landing/Landing.html"
                })
            ;
        }])

        .directive("eIntroduction", function() {
            return {
                restrict: "E",
                templateUrl: "/app/spa/landing/eIntroduction.html"
            };
        })
    ;

})();