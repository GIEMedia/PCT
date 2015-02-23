"use strict";

(function () {
    /* App Module */
    angular.module("pct.elearning", [
            'pct.elearning.theme',
            'pct.elearning.authen',
            'pct.elearning.course',
            'pct.elearning.test',
            'pct.elearning.certificate',

            'pct.elearning.api.Account',
            'pct.elearning.api.Security',

            'pct.elearning.api.Certificate',
            'pct.elearning.api.Course',
            'pct.elearning.api.Test',
            'pct.elearning.api.State',
            'pct.elearning.api.StateLicensure',
            'pct.elearning.api.Manager',

            'pct.elearning.local.Preference',

            'pct.elearning.landing',
            'pct.elearning.signup',
            'pct.elearning.userInfo',
            'pct.elearning.dashboard',
            'pct.elearning.profile',
            'pct.elearning.certificates',
            'ui.router',
            'angularMoment',
            'ngResource'
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
                .otherwise("/landing");
        })

        .config(function ($locationProvider) {
            $locationProvider.html5Mode(false).hashPrefix("!");
        })
    ;
})();
