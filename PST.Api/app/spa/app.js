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
            //'angularMoment',
            'ngResource'
    ])

        .run(["Api", function (Api) {
            // For development
//            Api.setHost("localhost:53130");
            Api.setHost("gie-test.prototype1.io");
        }])


        .run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }])

        .config(["$compileProvider", function ($compileProvider) {
            if ($compileProvider.debugInfoEnabled) {
                $compileProvider.debugInfoEnabled(false);
            }
        }])

        .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider
                // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
                .otherwise("/landing");
        }])

    ;
})();
