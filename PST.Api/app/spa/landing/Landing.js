"use strict";

(function () {

    angular.module('pct.elearning.landing', [
            'ui.router'
    ])
    
        .config(function ($stateProvider) {

            $stateProvider
                .state('landing', {
                    url: '/landing',
                    templateUrl: "/app/spa/landing/Landing.html",
                    controller: "landing.Ctrl"
                })
            ;
        })

        .controller("landing.Ctrl", function ($scope, $state, AccountService, StateService) {
            //AccountService.getAccount("123");

            $scope.signup = {};

            $scope.getStarted = function() {

                AccountService.createAccount($scope.signup);
                //$state.go("dashboard");
            };

            $scope.states = StateService.getStates();
        })

    ;

})();