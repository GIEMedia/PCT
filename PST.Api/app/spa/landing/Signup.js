"use strict";

(function () {

    angular.module('pct.elearning.signup', [
    ])
        .directive("signUp", ["AccountService", "StateService", "SecurityService", "$state", function(AccountService, StateService, SecurityService, $state) {
            return {
                restrict: "E",
                templateUrl: "/app/spa/landing/Signup.html",
                link: function($scope, elem, attrs) {
                    $scope.signup = {
                        loading: false
                    };

                    $scope.getStarted = function() {
                        $scope.signup.loading = true;
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
                                $scope.signup.loading = false;
                            })
                        ;
                        //$state.go("dashboard");
                    };

                    $scope.states = StateService.getStates();
                }
            };
        }])
    ;

})();