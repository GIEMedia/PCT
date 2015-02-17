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
        
        .controller("profile.Ctrl", function ($scope, StateService, ProfileService, CertificateService, AccountService) {
            $scope.stateLicensures = [
            ];
            $scope.managers = [
            ];
            $scope.states = StateService.getStates();

            AccountService.getAccount().success(function(account) {
                $scope.userInfoMaster = account;
                $scope.userInfo = angular.copy($scope.userInfoMaster);
            });


            //return angular.equals(SystemConfigService.config, $scope.config);

            $scope.equals = angular.equals;

            $scope.certificateCategories = CertificateService.getCertificateCategories();
        })
    ;

})();