"use strict";

(function () {

    angular.module('pct.elearning.signup', [
    ])
        /**
         * For the signup box in Landing page
         */
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
                                SecurityService.login($scope.signup.email, $scope.signup.password, true);
                            })
                            .onError(function(data) {
                                if (data.ModelState != null && data.ModelState[""] != null && data.ModelState[""].length == 1) {
                                    alert(data.ModelState[""][0]);
                                } else {
                                    alert(JSON.stringify(data));
                                }
                                $scope.signup.loading = false;
                                return true;
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