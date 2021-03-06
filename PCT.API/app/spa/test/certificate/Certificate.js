"use strict";

(function () {

    angular.module('pct.elearning.certificate', [
            'ui.router'
    ])
    
        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('certificate', {
                    url: '/certificate/:courseId',
                    templateUrl: "/app/spa/test/certificate/Certificate.html?v=" + htmlVer,
                    controller: "certificate.Ctrl",
                    resolve: {
                        certificate: ["CertificateService", "$stateParams", function(CertificateService, $stateParams) {
                            return CertificateService.getCertificate($stateParams.courseId);
                        }]
                    }
                })
            ;
        }])

        .controller("certificate.Ctrl", ["$scope", "$state", "$stateParams", "ManagerService", "certificate", "PrintService", function ($scope, $state, $stateParams, ManagerService, certificate, PrintService) {
            $scope.certificate = certificate.data;
            $scope.sent = false;
            $scope.sending = false;

            $scope.managers = [
                {}
            ];

            ManagerService.get($stateParams.courseId).success(function(managers) {
                if (Cols.isNotEmpty(managers)) {
                    $scope.managers = managers;
                }
            });

            $scope.send = function() {
                $scope.sending = true;

                ManagerService.send($stateParams.courseId, $scope.managers)
                    .success(function() {
                        $scope.sending = false;
                        $scope.sent = true;
                    })
                    .onError(function() {
                        $scope.sending = false;
                        $scope.error = true;
                        return true;
                    })
                ;

                return false;
            };

            //$scope.download = function() {
            //    var popupWin = window.open('about:blank', 'fax_printing', 'width=861,height=792');
            //
            //    PrintService.print(popupWin, {
            //        templateUrl: "app/spa/certification/certification.html?v=" + htmlVer,
            //        controller: "certification.ctrl",
            //        resolve: {
            //            course: function() { return certificate.data; }
            //        },
            //        parentScope: $scope
            //    });
            //    return false;
            //};

            $scope.download = function() {
                window.open($scope.certificate.pdf_url, "_blank");
                return false;
            };

        }])

    ;

})();