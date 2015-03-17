"use strict";

(function () {

    angular.module('pct.management.login', [
            'ui.router'
    ])
    
        .config(function ($stateProvider) {

            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: "/Areas/Management/app/spa/login/Login.html",
                    data: {
                        name: "Login"
                    },
                    controller: "login.Ctrl"
                })
            ;
        })

        .controller("login.Ctrl", function ($scope, $state, User, SecurityService) {
            $scope.login = {
                email: "w@w",
                password: "123123"
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
                    alert("Email is required");
                    return;
                }
                if (StringUtil.isBlank($scope.login.password)) {
                    alert("Password is required");
                    return;
                }

                $scope.view.submitting = true;
                SecurityService.login({
                    grant_type: "password",
                    username: $scope.login.email,
                    password: $scope.login.password
                })
                    .success(function() {
                        $state.go("courses");
                    })
                    .onError(function(error, status) {
                        $scope.view.submitting = false;
                        if (status == 400) {
                            alert('Your login failed.');
                            $scope.login.password = null;
                            return true;
                        } else {
                            return false;
                        }
                    })
                ;
            };
        })

    ;

})();