"use strict";

(function () {
    /* App Module */
    angular.module("pct.management", [
        'pct.Security',

        'pct.management.layout',
        'pct.management.theme',

        'pct.management.login',
        'pct.management.courses',
        'pct.management.testResults',
        'pct.management.users',

        'pct.management.course',

            //'angularMoment',
            //'ngResource'
    ])

        .run(function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        })

        .config(function ($compileProvider) {
            if ($compileProvider.debugInfoEnabled) {
                $compileProvider.debugInfoEnabled(false);
            }
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider
                // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
                .otherwise("/login");
        })

    ;
})();
