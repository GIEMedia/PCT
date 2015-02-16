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
        
        .controller("profile.Ctrl", function ($scope, StateService, ProfileService) {
            $scope.states = StateService.getStates();

            $scope.companyInfo = ProfileService.getCompanyInfo();
            $scope.userInfo = ProfileService.getUserInfo();
        })
    ;

})();