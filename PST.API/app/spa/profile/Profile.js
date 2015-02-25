"use strict";

(function () {

    angular.module('pct.elearning.profile', [
    ])
        .config(["$stateProvider", function ($stateProvider) {
        
            $stateProvider
                .state('profile', {
                    url: '/profile',
                    templateUrl: "/app/spa/profile/Profile.html",
                    controller: "profile.Ctrl"
                })
            ;
        }])
        
        .controller("profile.Ctrl", ["$scope", "StateService", function ($scope, StateService ) {

            $scope.states = StateService.getStates();
            $scope.equals = angular.equals;

        }])

        .directive("accountForm", ["AccountService", function(AccountService) {
            return {
                restrict: "E",
                scope: true,
                templateUrl: "/app/spa/profile/AccountForm.html",
                link: function($scope, elem, attrs) {
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
        }])

        .directive("passwordForm", ["AccountService", function(AccountService) {
            return {
                restrict: "E",
                scope: true,
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
                        if (value) {
                            $scope.error = null;
                        }
                    });
                    
                    $scope.invalid = function() {
                        return StringUtil.isEmpty($scope.passwordForm.old_password);
                    };
                }
            };
        }])

        .directive("stateLicensuresForm", ["CertificateService", "StateLicensureService", function(CertificateService, StateLicensureService) {
            return {
                restrict: "E",
                scope: true,
                templateUrl: "/app/spa/profile/StateLicensuresForm.html",
                link: function($scope, elem, attrs) {
                    StateLicensureService.get().success(function(sls) {
                        $scope.stateLicensures = sls;
                        for (var i = 0; i < sls.length; i++) {
                            var sl = sls[i];
                            sl.confirmNum = sl.license_num;
                        }
                        $scope.stateLicensuresMaster = angular.copy($scope.stateLicensures);
                    });
                    $scope.certificateCategories = CertificateService.getCertificateCategories();


                    $scope.update = function() {
                        StateLicensureService.update($scope.stateLicensures).success(function() {
                            $scope.stateLicensuresMaster = angular.copy($scope.stateLicensures);
                        });
                    };
                }
            };
        }])
        .directive("managersForm", ["ManagerService", function(ManagerService) {
            return {
                restrict: "E",
                scope: true,
                templateUrl: "/app/spa/profile/ManagersForm.html",
                link: function($scope, elem, attrs) {
                    ManagerService.get().success(function(managers) {
                        $scope.managers = managers;
                        $scope.managersMaster = angular.copy($scope.managers);
                    });

                    $scope.update = function() {
                        ManagerService.update($scope.managers).success(function() {
                            $scope.managersMaster = angular.copy($scope.managers);
                        });
                    };
                }
            };
        }])
    ;

})();