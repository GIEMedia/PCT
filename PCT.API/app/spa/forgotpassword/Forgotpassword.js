"use strict";

(function () {

    angular.module('pct.elearning.forgotpassword', [
    ])
        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('forgotpassword', {
                    url: '/forgotpassword?u&t',
                    templateUrl: "/app/spa/forgotpassword/Forgotpassword.html?v=" + htmlVer,
                    controller: "forgotpassword.Ctrl"
                })
            ;
        }])

        .controller("forgotpassword.Ctrl", ["$scope", "$state", "$stateParams", "$timeout", "ForgotpasswordService", function ($scope, $state, $stateParams, $timeout, ForgotpasswordService) {

            if (!$stateParams.u || !$stateParams.t ) {
                // Requesting reset password email form
                $scope.sent = false;
                $scope.sending = false;

                $scope.fp = {
                    email: null
                };

                $scope.sendRequest = function() {
                    $scope.sending = true;
                    ForgotpasswordService.requestResetPasswordEmail($scope.fp.email)
                        .success(function() {
                            $scope.sending = false;
                            $scope.sent = true;
                        })
                        .error(function() {
                            $scope.sending = false;
                            $scope.sent = true;
                        })
                    ;
                };
            } else {
                $scope.sent = false;
                $scope.sending = false;

                $scope.fp = {
                    newPassword: null
                };
                $scope.username = $stateParams.u;
                var key = $stateParams.t;


                $scope.sendRequest = function() {
                    $scope.sending = true;
                    ForgotpasswordService.resetPassword($stateParams.u, key, $scope.fp.newPassword)
                        .success(function() {
                            $scope.sending = false;
                            $scope.sent = true;
                            $timeout(function() {
                                $state.go('landing');
                            }, 2000);
                        })
                        .onError(function() {
                            $scope.sending = false;
                            $scope.error = true;
                            return true;
                        })
                    ;
                };
            }
        }])

    ;

})();