"use strict";

(function () {
    /* App Module */
    angular.module("pct.elearning", [
            'pct.markup',

            'pct.elearning.theme',
            'pct.elearning.authen',
            'pct.elearning.course',
            'pct.elearning.test',
            'pct.elearning.certificate',

            'pct.elearning.api.Account',
            'pct.Security',

            'pct.elearning.api.Certificate',
            'pct.elearning.api.ForgotpasswordService',
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
            'pct.elearning.forgotpassword',
            'pct.elearning.profile',
            'pct.elearning.certificates',

            'pct.elearning.layout',

            'ui.router',
            'ngResource'
    ])

        .config(["ApiProvider", function (ApiProvider) {
            ApiProvider.setHost(appHost); // set in _layout.cshtml
        }])

        .config(["SecurityProvider", function(SecurityProvider) {
            SecurityProvider.set({
                loginState : "landing",
                defaultUserState : "dashboard",
                allowUnauthen : function(state) {
                    return state.name == "landing" || state.name == "forgotpassword" || state.name == "coursePreview" || state.name == "testPreview";
                }
            });
        }])

        .run(["Security", "Api", "$q", function(Security, Api, $q) {
            Security.setApi({
                login: function(data) {
                    var defer = $q.defer();

                    Api.postForm("api/account/login", data).onError(function() {return true;}).then(
                        defer.resolve,
                        function(resp) {
                            if (resp.status == 400) {
                                defer.reject('Incorrect Username or Password.');
                            } else {
                                defer.reject("Error: Unknown");
                            }
                        }
                    );
                    return defer.promise;
                }
            });
        }])

        .run(["Api", "LayoutService", function(Api, LayoutService) {
            Api.onError(function(data, status) {
                if (status == 500) {
                    LayoutService.showError(10000);
                    return true;
                }
            });
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
