"use strict";

(function () {

    angular.module('pct.elearning.userInfo', [
    ])
        /**
         * This link function is used for both userInfo component (in page layout header) and formSignin component (used by mobile view)
         */
        .factory("LoginFormLink", ["User", "SecurityService", "$state", function( User, SecurityService, $state ) {
            return function($scope, elem, attrs) {
                $scope.ui = {
                    loggingin: false
                };

                $scope.User = User;
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