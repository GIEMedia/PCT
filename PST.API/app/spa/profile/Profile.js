"use strict";

(function () {

    angular.module('pct.elearning.profile', [
    ])
        .config(function ($stateProvider) {
        
            $stateProvider
                .state('profile', {
                    url: '/profile',
                    templateUrl: "/app/spa/profile/Profile.html",
                    controller: "profile.Ctrl"
                })
            ;
        })
        
        .controller("profile.Ctrl", function ($scope, CertificateService ) {
            $scope.stateLicensures = [
            ];
            $scope.managers = [
            ];

            //return angular.equals(SystemConfigService.config, $scope.config);

            $scope.equals = angular.equals;

            $scope.certificateCategories = CertificateService.getCertificateCategories();
        })

        .directive("accountForm", function(AccountService, StateService) {
            return {
                restrict: "E",
                templateUrl: "/app/spa/profile/AccountForm.html",
                link: function($scope, elem, attrs) {

                    $scope.states = StateService.getStates();

                    AccountService.getAccount().success(function(account) {
                        $scope.userInfo = account;
                        $scope.userInfoMaster = angular.copy($scope.userInfo);
                    });

                    $scope.updateAccount = function() {
                        AccountService.updateAccount($scope.userInfo).success(function() {
                            $scope.userInfoMaster = angular.copy($scope.userInfo);
                        });
                    };
                }
            };
        })

        .directive("passwordForm", function(AccountService) {
            return {
                restrict: "E",
                templateUrl: "/app/spa/profile/PasswordForm.html",
                link: function($scope, elem, attrs) {
                    function newForm() {
                        return {
                            old_password: null,
                            new_password: null,
                            new_password_confirm: null
                        };
                    }

                    $scope.error = null;

                    $scope.focusPassword = null;

                    $scope.passwordForm = newForm();

                    $scope.changePassword = function() {
                        AccountService.changePassword($scope.passwordForm)
                            .success(function() {
                                $scope.passwordForm = newForm();
                            })
                            .error(function(error) {
                                $scope.passwordForm.old_password = null;
                                $scope.focusPassword = true;
                                $scope.error = error.ModelState[""][0];
                            })
                        ;
                    };

                    $scope.$watch("error != null && passwordForm.old_password.length", function(value) {
                        console.log(value);
                        if (value) {
                            $scope.error = null;
                        }
                    });
                    
                    $scope.invalid = function() {
                        return StringUtil.isEmpty($scope.passwordForm.old_password);
                    };
                }
            };
        })
    ;

})();