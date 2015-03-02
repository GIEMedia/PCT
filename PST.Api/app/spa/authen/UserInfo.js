"use strict";

(function () {

    angular.module('pct.elearning.userInfo', [
    ])
        /**
         * This link function is used for both userInfo component (in page layout header) and formSignin component (used by mobile view)
         */
        .factory("LoginFormLink", ["User", "SecurityService", "$state", function( User, SecurityService, $state ) {
            return function($scope, elem, attrs) {
                $scope.User = User;
                $scope.error = null;
                $scope.$watch(function() {return User.loggedIn;}, function(loggedIn) {
                    $scope.pristine = true;
                    if (!loggedIn) {
                        $scope.loginForm = {
                            email: null,
                            password: null
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

                    SecurityService.login({
                        grant_type: "password",
                        username: $scope.loginForm.email,
                        password: $scope.loginForm.password
                    })
                        .success(function() {
                            $state.go("dashboard");
                        })
                        .error(function() {
                            alert('Your login failed.');
                            $scope.loginForm.password = null;
                        })
                    ;
                };
                $scope.logout = function() {
                    SecurityService.logout();
                };
            }
        }])

        /**
         * Used in mobile view, landing page
         */
        .directive("formSignin", ["LoginFormLink", function(LoginFormLink) {
            return {
                restrict: "C",
                scope: true,
                link: LoginFormLink
            };
        }])

        /**
         * Used in _Layout's header (which mean appear in all app pages).
         * If logged in, this will show user's full name, dropdown for all profile links.
         * If not logged in, this will show a login form
         */
        .directive("userInfo", ["LoginFormLink", function(LoginFormLink) {
            return {
                restrict: "E",
                templateUrl: "/app/spa/authen/UserInfo.html",
                scope: true,
                link: LoginFormLink
            };
        }])
    ;

})();