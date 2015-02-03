"use strict";

(function () {

    angular.module('pct.elearning.certificate', [
            'ui.router'
    ])
    
        .config(function ($stateProvider) {

            $stateProvider
                .state('certificate', {
                    url: '/certificate',
                    templateUrl: "/app/spa/test/Certificate.html",
                    controller: "certificate.Ctrl"
                })
            ;
        })

        .controller("certificate.Ctrl", function ($scope, $state) {
            $scope.certificate = {
                name: "PCT Pest Insecticide",
                picture: "/app/css/images/certificate.jpg"
            };

            $scope.addresses = [
                {}
            ];

            $scope.send = function() {

                $state.go("dashboard");

                return false;
            };

            $scope.download = function() {
                window.open($scope.certificate.picture, "_blank");
                return false;
            };
        })

    ;

})();