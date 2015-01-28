"use strict";

(function () {

    angular.module('pct.elearning.landing', [
            'ui.router'
    ])
    
        .config(function ($stateProvider) {

            $stateProvider
                .state('landing', {
                    url: '/landing',
                    templateUrl: "/app/landing/Landing.html",
                    controller: "landing.Ctrl"
                })
            ;
        })

        .controller("landing.Ctrl", function ($scope) {
        })

    ;

})();