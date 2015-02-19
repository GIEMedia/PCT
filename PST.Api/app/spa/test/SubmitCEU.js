"use strict";

(function () {

    angular.module('pct.elearning.test.submit_ceu', [
    ])
        .directive("submitCeu", function(StateService, $state, $stateParams, CertificateService, StateLicensureService) {
            return {
                restrict: "E",
                scope: true,
                templateUrl: "/app/spa/test/SubmitCEU.html",
                link: function($scope, elem, attrs) {
                    $scope.stateLicensures = [
                        {}
                    ];

                    StateLicensureService.get().success(function(licensures) {
                        if (Cols.isNotEmpty(licensures)) {
                            $scope.stateLicensures = licensures;
                            for (var i = 0; i < $scope.stateLicensures.length; i++) {
                                var sl = $scope.stateLicensures[i];
                                sl.confirmNum = sl.license_num;
                            }
                        }
                    });


                    $scope.states = StateService.getStates();
                    $scope.categories = CertificateService.getCertificateCategories();

                    $scope.send = function() {
                        StateLicensureService.send($stateParams.courseId, $scope.stateLicensures).success(function() {
                            $state.go("certificate", {courseId: $stateParams.courseId});
                        });

                        return false;
                    };
                }
            };
        })
    ;

})();