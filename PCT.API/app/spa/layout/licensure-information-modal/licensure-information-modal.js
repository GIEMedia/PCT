"use strict";

(function () {

    angular.module("pct.elearning.layout.licensure-modal", [
    ])
        .run(["SecurityService", "licensureModal", "gieLocalStorage", "User", function (SecurityService, licensureModal, gieLocalStorage, User) {
            SecurityService.onLogin(function () {
                var byUser = gieLocalStorage.forUser(User.ID);

                if(byUser.get("licensureInfoModal") == null) {

                    licensureModal.open();

                    byUser.save("licensureInfoModal", new Date().getTime());
                }
            })
        }])

        .factory("licensureModal", ["modal", function(modal) {
            return {
                open: function () {
                    return modal.open({
                        templateUrl: "app/spa/layout/licensure-information-modal/licensure-information-modal.html?v=" + htmlVer,
                        cssClass: "licensure-information-modal",
                        bodyClass: "modal-open",
                        controller: "licensure-information-modal.Ctrl"
                    });
                }
            };
        }])

        .controller("licensure-information-modal.Ctrl", ["$scope", "$modalInstance", "StateLicensureService", "CourseService", "StateService", function($scope, $modalInstance, StateLicensureService, CourseService, StateService) {
            $scope.skipStep  = $modalInstance.dismiss;

            $scope.states = StateService.getStates();
            $scope.equals = angular.equals;

            CourseService.getCertificationCategories().then(function (resp) {
                $scope.certificationCategories = resp.data;
            });

            $scope.filteredCertification = function (stateCode) {
                return Cols.filter($scope.certificationCategories, function (categori) {
                    return categori.state == stateCode;
                });
            };

            $scope.stateLicensuresForm = {
                loading: true
            };

            StateLicensureService.get().success(function(sls) {
                $scope.stateLicensures = sls.length > 0 ? sls : [{}];
                for (var i = 0; i < sls.length; i++) {
                    var sl = sls[i];
                    sl.confirmNum = sl.license_num;
                }
                $scope.stateLicensuresMaster = angular.copy($scope.stateLicensures);
                $scope.stateLicensuresForm.loading = false;
            });

            $scope.update = function() {
                if(!angular.equals($scope.stateLicensuresMaster, $scope.stateLicensures)) {
                    $scope.stateLicensuresForm.loading = true;
                    StateLicensureService.update($scope.stateLicensures).success(function() {
                        $scope.stateLicensuresForm.loading = false;
                        $scope.stateLicensuresMaster = angular.copy($scope.stateLicensures);
                    });
                }
                $modalInstance.close();
            };
        }])

        .directive("stateLicensuresFormModal", function() {
            return {
                restrict: "E",
                templateUrl: "app/spa/layout/licensure-information-modal/state-licensures-form.html?v=" + htmlVer,
                scope: true
            };
        })
    ;

})();