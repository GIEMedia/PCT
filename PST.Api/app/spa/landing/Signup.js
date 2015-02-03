"use strict";

(function () {

    angular.module('pct.elearning.signup', [
    ])
        .directive("signUp", function(AccountService, StateService) {
            return {
                restrict: "E",
                templateUrl: "/app/spa/landing/Signup.html",
                link: function($scope, elem, attrs) {
                    $scope.signup = {};

                    $scope.getStarted = function() {

                        AccountService.createAccount($scope.signup);
                        //$state.go("dashboard");
                    };

                    $scope.states = StateService.getStates();
                }
            };
        })
    ;

})();