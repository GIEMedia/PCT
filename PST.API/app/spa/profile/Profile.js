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
        
        .controller("profile.Ctrl", function ($scope) {
            
        })
    ;

})();