"use strict";

(function () {

    angular.module('pct.management.login', [
    ])
    
        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: "Areas/Management/app/spa/login/Login.html?v=" + htmlVer,
                    data: {
                        name: "Login"
                    },
                    controller: "login.Ctrl"
                })
            ;
        }])

        .controller("login.Ctrl", ["$scope", "$state", "User", "SecurityService", "modalAlert", function ($scope, $state, User, SecurityService, modalAlert) {
            $scope.login = {
            };

            $scope.view = {
                submitting: false
            };

            if (User.loggedIn) {
                $state.go("courses");
            }

            $scope.submitLogin = function() {
                $scope.pristine = false;

                if (StringUtil.isBlank($scope.login.email)) {
                    modalAlert.open("Email is required", "Please input your email to login");
                    return;
                }
                if (StringUtil.isBlank($scope.login.password)) {
                    modalAlert.open("Password is required", "Please input your password to login");
                    return;
                }

                $scope.view.submitting = true;
                SecurityService.login($scope.login.email, $scope.login.password, false).then(
                    function() {
                        $state.go("courses");
                    },
                    function(reason) {
                        $scope.view.submitting = false;
                        modalAlert.open(reason, reason);
                        $scope.login.password = null;
                    }
                );
            };
        }])
    ;

})();