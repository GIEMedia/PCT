"use strict";

(function () {

    angular.module("pct.management.settings.certification-categories", [
    ])
        .directive("certificationCategories", function() {
            return {
                restrict: "E",
                templateUrl: "Areas/Management/app/spa/settings/certification-categories/certification-categories.html?v=" + htmlVer,
                controller: ["$scope", "CourseService", "Fancybox", "modal", "modalConfirm", function ($scope, CourseService, Fancybox, modal, modalConfirm) {

                    function refresh () {
                        CourseService.getCertificationCategories().then(function (resp) {
                            $scope.listCertifications = resp.data;
                        });
                    }

                    refresh();

                    $scope.removeCertification = function (certification) {
                        modalConfirm.open("Confirm deleting certification", "Are you sure to remove this certification?").result.then(function () {
                            $scope.removing = true;
                            CourseService.deleteCertificationCategory(certification.id).success(function() {
                                Cols.remove(certification, $scope.listCertifications);
                                $scope.removing = false;
                            }).error(function() {
                                $scope.removing = false;
                            });
                        });
                    };

                    $scope.addCertification = function () {
                        modal.open({
                            templateUrl: "Areas/Management/app/spa/settings/certification-categories/certification-modal.html?v=" + htmlVer,
                            controller: "certification-modal.ctrl",
                            width: 350,
                            resolve: {
                                certification: function () {
                                    return {};
                                }
                            }
                        }).result.then(function () {
                            refresh();
                        });
                    };

                    $scope.updateCertification = function (certification) {
                        modal.open({
                            templateUrl: "Areas/Management/app/spa/settings/certification-categories/certification-modal.html?v=" + htmlVer,
                            controller: "certification-modal.ctrl",
                            width: 350,
                            resolve: {
                                certification: function () {
                                    return certification;
                                }
                            }
                        }).result.then(function () {
                            refresh();
                        });
                    }
                }]
            };
        })

        .controller("certification-modal.ctrl", ["$scope", "StateService", "$modalInstance", "CourseService", "certification", function($scope, StateService, $modalInstance, CourseService, certification) {
            $scope.States = StateService.getStates();

            $scope.close = function () {
                $modalInstance.dismiss();
            };

            $scope.certification = certification;

            $scope.save = function () {
                CourseService.upsertCertificationCategory($scope.certification).then(function () {
                    $modalInstance.close();
                });
            }

        }])
    ;

})();