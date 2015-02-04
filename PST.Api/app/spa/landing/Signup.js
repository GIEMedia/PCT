"use strict";

(function () {

    angular.module('pct.elearning.signup', [
    ])
        .directive("signUp", function(AccountService, StateService, SecurityService, $state) {
            return {
                restrict: "E",
                templateUrl: "/app/spa/landing/Signup.html",
                link: function($scope, elem, attrs) {
                    $scope.signup = {};

                    $scope.getStarted = function() {

                        AccountService.createAccount($scope.signup)
                            .success(function() {
                                SecurityService.login({
                                    grant_type: "password",
                                    username: $scope.signup.email,
                                    password: $scope.signup.password
                                })
                                    .success(function() {
                                        $state.go("dashboard");
                                    })
                                ;
                            })
                            .error(function(data) {
                                //{"Message":"The request is invalid.","ModelState":{"":["Account with this UserName already exists"]}}
                                alert(JSON.stringify(data));
                            })
                        ;
                        //$state.go("dashboard");
                    };

                    $scope.states = StateService.getStates();
                }
            };
        })
    ;

})();