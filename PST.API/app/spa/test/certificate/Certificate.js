"use strict";

(function () {

    angular.module('pct.elearning.certificate', [
            'ui.router'
    ])
    
        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('certificate', {
                    url: '/certificate/:courseId',
                    templateUrl: "/app/spa/test/certificate/Certificate.html",
                    controller: "certificate.Ctrl"
                })
            ;
        }])

        .controller("certificate.Ctrl", ["$scope", "$state", "$stateParams", "CertificateService", "ManagerService", function ($scope, $state, $stateParams, CertificateService, ManagerService) {
            $scope.certificate = CertificateService.getCertificate($stateParams.courseId);

            $scope.managers = [
                {}
            ];

            ManagerService.get($stateParams.courseId).success(function(managers) {
                if (Cols.isNotEmpty(managers)) {
                    $scope.managers = managers;
                }
            });



            $scope.send = function() {

                ManagerService.send($stateParams.courseId, $scope.managers).success(function() {
                    $state.go("dashboard");
                });

                return false;
            };

            $scope.download = function() {
                window.open($scope.certificate.pdf_url, "_blank");
                return false;
            };
        }])

    ;

})();