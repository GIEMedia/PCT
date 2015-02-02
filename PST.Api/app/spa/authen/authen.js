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

        .run(function($rootScope, User) {
            $rootScope.User = User;
        })


        .directive("userInfo", function(User, SecurityService, $state) {
            return {
                restrict: "E",
                templateUrl: "/app/spa/authen/UserInfo.html",
                scope: true,
                link: function($scope, elem, attrs) {
                    $scope.error = null;
                    $scope.$watch(function() {return User.loggedIn;}, function(loggedIn) {
                        if (!loggedIn) {
                            $scope.loginForm = {
                                email: null,
                                password: null
                            };
                        }
                    });
                    $scope.login = function() {
                        SecurityService.login({
                            grant_type: "password",
                            username: $scope.loginForm.email,
                            password: $scope.loginForm.password
                        },
                        function(resp) {
                            //console.log(resp);
                            if (resp != null) {
                                $scope.error = null;
                                User.loggedIn = true;
                                User.firstName = "David";
                                User.fullName = "David Hurt";
                            } else {
                                $scope.error = "Wrong username/password";
                            }
                        });
                    };
                    $scope.logout = function() {
                        SecurityService.logout();
                        $state.go("landing");
                    };
                }
            };
        })
    ;

})();