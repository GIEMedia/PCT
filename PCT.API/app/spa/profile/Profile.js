"use strict";

(function () {

    angular.module('pct.elearning.profile', [
    ])
        .config(["$stateProvider", function ($stateProvider) {
        
            $stateProvider
                .state('profile', {
                    url: '/profile',
                    templateUrl: "/app/spa/profile/Profile.html?v=" + htmlVer,
                    controller: "profile.Ctrl"
                })
            ;
        }])
        
        .controller("profile.Ctrl", ["$scope", "StateService", function ($scope, StateService ) {

            $scope.states = StateService.getStates();
            $scope.equals = angular.equals;

        }])

        /**
         * For the account form in Profile page
         */
        .directive("accountForm", ["AccountService", function(AccountService) {
            return {
                restrict: "E",
                scope: true,
                templateUrl: "/app/spa/profile/AccountForm.html?v=" + htmlVer,
                link: function($scope, elem, attrs) {
                    $scope.accountForm = {
                        loading: false
                    };
                    AccountService.getAccount().success(function(account) {
                        $scope.userInfo = account;
                        $scope.userInfoMaster = angular.copy($scope.userInfo);
                    });

                    $scope.updateAccount = function() {
                        $scope.accountForm.loading = true;
                        AccountService.updateAccount($scope.userInfo).success(function() {
                            $scope.userInfoMaster = angular.copy($scope.userInfo);
                            $scope.accountForm.loading = false;
                        });
                    };
                }
            };
        }])

        /**
         * For the password form in Profile page
         */
        .directive("passwordForm", ["AccountService", function(AccountService) {
            return {
                restrict: "E",
                scope: true,
                templateUrl: "/app/spa/profile/PasswordForm.html?v=" + htmlVer,
                link: function($scope, elem, attrs) {
                    function newForm() {
                        return {
                            old_password: null,
                            new_password: null,
                            new_password_confirm: null
                        };
                    }

                    $scope.error = null;
                    $scope.success = false;

                    $scope.focusPassword = null;

                    $scope.passwordForm = newForm();

                    $scope.changePassword = function() {
                        AccountService.changePassword($scope.passwordForm)
                            .success(function() {
                                $scope.passwordForm = newForm();
                                $scope.success = true;
                            })
                            .onError(function(error, status) {
                                if (status == 400) {
                                    $scope.passwordForm.old_password = null;
                                    $scope.focusPassword = true;
                                    $scope.error = error.ModelState[""][0];
                                    return true;
                                } else {
                                    return false;
                                }
                            })
                        ;
                    };

                    $scope.$watch("(error != null || success) && passwordForm.old_password.length", function(value) {
                        if (value) {
                            $scope.error = null;
                            $scope.success = false;
                        }
                    });
                    
                    $scope.invalid = function() {
                        return StringUtil.isEmpty($scope.passwordForm.old_password);
                    };
                }
            };
        }])

        /**
         * For the State Licensures form in Profile page
         */
        .directive("stateLicensuresForm", ["CertificateService", "StateLicensureService", function(CertificateService, StateLicensureService) {
            return {
                restrict: "E",
                scope: true,
                templateUrl: "/app/spa/profile/StateLicensuresForm.html?v=" + htmlVer,
                controller: ["$scope", "CourseService", function($scope, CourseService) {

                    CourseService.getCertificationCategories().then(function (resp) {
                        $scope.certificationCategories = resp.data;
                    });
                    
                    $scope.filteredCertification = function (stateCode) {
                        return Cols.filter($scope.certificationCategories, function (categori) {
                            return categori.state == stateCode;
                        });
                    };

                    $scope.stateLicensuresForm = {
                        loading: true
                    };

                    StateLicensureService.get().success(function(sls) {
                        $scope.stateLicensures = sls;
                        for (var i = 0; i < sls.length; i++) {
                            var sl = sls[i];
                            sl.confirmNum = sl.license_num;
                        }
                        $scope.stateLicensuresMaster = angular.copy($scope.stateLicensures);
                        $scope.stateLicensuresForm.loading = false;
                    });

                    $scope.update = function() {
                        $scope.stateLicensuresForm.loading = true;
                        StateLicensureService.update($scope.stateLicensures).success(function() {
                            $scope.stateLicensuresForm.loading = false;
                            $scope.stateLicensuresMaster = angular.copy($scope.stateLicensures);
                        });
                    };
                }]
            };
        }])

        .directive("stateLicensureRow", function() {
            return {
                restrict: "A",
                controller: ["$scope", function($scope) {
                    $scope.$watch("stateLicensure.state", function(newVal, oldVal) {
                        if(newVal != oldVal) {
                            $scope.stateLicensure.category = null;
                        }
                    });
                }]
            };
        })

        /**
         * For the Managers form in Profile page
         */
        .directive("managersForm", ["ManagerService", function(ManagerService) {
            return {
                restrict: "E",
                scope: true,
                templateUrl: "/app/spa/profile/ManagersForm.html?v=" + htmlVer,
                link: function($scope, elem, attrs) {
                    $scope.managersForm = {
                        loading: true
                    };

                    ManagerService.get().success(function(managers) {
                        $scope.managers = managers;
                        $scope.managersMaster = angular.copy($scope.managers);

                        $scope.managersForm.loading = false;
                    });

                    $scope.update = function() {
                        $scope.managersForm.loading = true;
                        ManagerService.update($scope.managers).success(function() {
                            $scope.managersMaster = angular.copy($scope.managers);
                            $scope.managersForm.loading = false;
                        });
                    };
                }
            };
        }])
    ;

})();