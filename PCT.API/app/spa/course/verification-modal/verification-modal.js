"use strict";

(function () {

    angular.module('pct.elearning.course.verification-modal', [
        ])

        .factory("verificationModal", ["modal", function(modal) {
            return {
                open: function() {
                    return modal.open({
                        templateUrl: "app/spa/course/verification-modal/verification-modal.html?v=" + htmlVer,
                        controller: "course.verification-modal.ctrl",
                        modal: true,
                        cssClass: "verification-modal"
                    });
                }
            };
        }])

        .controller("course.verification-modal.ctrl", ["$scope", "$modalInstance", "CourseService", "$stateParams", function($scope, $modalInstance, CourseService, $stateParams) {
            $scope.view = {
                step: 1
            };

            $scope.nextStep = function () {
                $scope.view.step = 2;
                CourseService.verifyStatement($stateParams.id, $scope.view.initials).then(function () {
                    $scope.view.initials = null;
                });
            };

            $scope.close = $modalInstance.close;
        }])
    ;

})();