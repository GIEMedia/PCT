"use strict";

(function () {

    angular.module('pct.elearning.certificates', [
    ])
        .config(function ($stateProvider) {
        
            $stateProvider
                .state('certificates', {
                    url: '/certificates',
                    templateUrl: "/app/spa/certificates/Certificates.html",
                    controller: "certificates.Ctrl"
                })
            ;
        })
        
        .controller("certificates.Ctrl", function ($scope, CertificateService) {
            CertificateService.getEarnedCertificates().success(function(certificates) {
                $scope.earnedCertificates = certificates;
            });
        })
    ;

})();