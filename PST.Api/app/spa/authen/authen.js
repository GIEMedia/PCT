"use strict";

(function () {

    angular.module('pct.elearning.authen', [
    ])
        .factory("User", function() {
            return {
                loggedIn: false
            };
            //return {
            //    loggedIn: true,
            //    firstName: "David",
            //    fullName: "David Hurt"
            //};
        })

        //.run(function($rootScope, User) {
        //    $rootScope.User = User;
        //})


        .directive("userInfo", function(User, SecurityService, $state) {
            return {
                restrict: "E",
                templateUrl: "/app/spa/authen/UserInfo.html",
                scope: true,
                link: function($scope, elem, attrs) {
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
            };
        })
    ;

})();