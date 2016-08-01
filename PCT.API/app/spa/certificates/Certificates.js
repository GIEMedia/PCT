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
        
        .directive("pctCertificates", ["CertificateService", "PrintService", function(CertificateService, PrintService) {
            return {
                restrict: "A",
                scope: true,
                templateUrl: "/app/spa/certificates/Certificates.html?v=" + htmlVer,
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

                    //$scope.download_certificate = function (course) {
                    //    var popupWin = window.open('about:blank', 'fax_printing', 'width=861,height=792');
                    //
                    //    PrintService.print(popupWin, {
                    //        templateUrl: "app/spa/certification/certification.html?v=" + htmlVer,
                    //        controller: "certification.ctrl",
                    //        resolve: {
                    //            course: function() { return course; }
                    //        },
                    //        parentScope: $scope
                    //    });
                    //}
                }
            };
        }])
    ;

})();