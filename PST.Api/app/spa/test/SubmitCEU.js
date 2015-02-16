"use strict";

(function () {

    angular.module('pct.elearning.test.submit_ceu', [
    ])
        .directive("submitCeu", function(StateService, $state, CertificateService) {
            return {
                restrict: "E",
                scope: true,
                templateUrl: "/app/spa/test/SubmitCEU.html",
                link: function($scope, elem, attrs) {
                    $scope.stateLicensures = [
                        {}
                    ];

                    $scope.states = StateService.getStates();
                    $scope.categories = CertificateService.getCertificateCategories();

                    $scope.send = function() {
                        $state.go("certificate");

                        return false;
                    };
                }
            };
        })
    ;

})();