"use strict";

(function () {

    angular.module('pct.elearning.certificates', [
    ])
        .config(["$stateProvider", function ($stateProvider) {
        
            $stateProvider
                .state('certificates', {
                    url: '/certificates',
                    templateUrl: "/app/spa/certificates/CertificatesPage.html"
                })
            ;
        }])
        
        .directive("pctCertificates", ["CertificateService", function(CertificateService) {
            return {
                restrict: "A",
                scope: true,
                templateUrl: "/app/spa/certificates/Certificates.html",
                link: function($scope, elem, attrs) {
                    $scope.viewConfig = $scope.$eval(attrs.pctCertificates);

                    if ($scope.viewConfig.hideOnEmpty) {
                        $scope.$watch("(earnedCertificates.length || 0) > 0", function(hasData) {
                            if (hasData) {
                                elem.show();
                            } else {
                                elem.hide();
                            }
                        });
                    }

                    CertificateService.getEarnedCertificates().success(function(certificates) {
                        $scope.earnedCertificates = certificates;
                    });
                }
            };
        }])
    ;

})();