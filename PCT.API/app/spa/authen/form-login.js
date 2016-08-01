"use strict";

(function () {

    angular.module('pct.elearning.form-login', [
    ])
        .controller("login-form.ctrl", ["$scope", "SecurityService", "User", function($scope, SecurityService, User ) {
            $scope.ui = {
                loggingin: false
            };

            $scope.error = null;
            $scope.$watch(function() {return User.loggedIn;}, function(loggedIn) {
                $scope.pristine = true;
                if (!loggedIn) {
                    $scope.loginForm = {
                        email: localStorage.remembered_login,
                        password: null,
                        remember: localStorage.remembered_login != null
                    };
                }
            });
            $scope.login = function() {
                $scope.pristine = false;

                if (StringUtil.isBlank($scope.loginForm.email)) {
                    alert("Email is required");
                    return;
                }
                if (StringUtil.isBlank($scope.loginForm.password)) {
                    alert("Password is required");
                    return;
                }

                $scope.ui.loggingin = true;
                SecurityService.login($scope.loginForm.email, $scope.loginForm.password, $scope.loginForm.remember).then(
                    function() {
                        $scope.ui.loggingin = false;
                    },
                    function(reason) {
                        $scope.ui.loggingin = false;
                        alert(reason);
                        $scope.loginForm.password = null;
                    }
                );
            };
        }])

        /**
         * Used in mobile view, landing page
         */
        .directive("formSignin", function() {
            return {
                restrict: "C",
                scope: true,
                controller: "login-form.ctrl"
            };
        })
        .directive("formSigninInline", function() {
            return {
                restrict: "E",
                scope: {},
                templateUrl: "app/spa/authen/form-signin-inline.html?v=" + htmlVer,
                controller: "login-form.ctrl"
            };
        })
    ;

})();