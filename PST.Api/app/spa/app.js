"use strict";

(function () {
    /* App Module */
    angular.module("pct.elearning", [
            'pct.elearning.theme',
            'pct.elearning.authen',
            'pct.elearning.course',
            'pct.elearning.test',

            'pct.elearning.api.Test',

            'pct.elearning.landing',
            'pct.elearning.dashboard',
            'ui.router',
            'ngResource'
    ])

        .run(function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        })

        .config(function ($compileProvider) {
            //if ($compileProvider.debugInfoEnabled) {
            //    $compileProvider.debugInfoEnabled(false);
            //}
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider
                // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
                .otherwise("/landing");
        })

        .config(function ($locationProvider) {
            $locationProvider.html5Mode(false).hashPrefix("!");
        })
    ;
})();
