"use strict";

(function () {

    angular.module('pct.management.settings.manufacturer', [
    ])
        .directive("settingsManufaturers", ["ManufacturerService", function(ManufacturerService) {
            return {
                restrict: "E",
                scope: true,
                templateUrl: "Areas/Management/app/spa/settings/Manufaturers.html",
                link: function($scope, elem, attrs) {
                    $scope.adding = {
                        name: null,
                        submitting: false
                    };

                    ManufacturerService.getList().success(function(list) {
                        $scope.list = list;
                    });

                    $scope.add = function() {
                        $scope.adding.submitting = true;
                        return ManufacturerService.add($scope.adding.name).success(function(newMan) {
                            $scope.adding.submitting = false;
                            $scope.adding.name = null;
                            $scope.list.push(newMan);
                        });
                    };
                    $scope.addWithImage = function(image) {
                        if (image == null) {
                            return;
                        }
                        $scope.add().success(function(man) {
                            $scope.upload(image, man);
                        });
                    };

                    $scope.upload = function(image, man) {
                        if (image == null) {
                            return;
                        }

                        ManufacturerService.uploadImage(image, man.manufacturer_id).success(function(man1) {
                            man.image_url = man1.image_url;
                        });
                    }
                }
            };
        }])

        .directive("settingsManufacturerRow", ["ManufacturerService", "Fancybox", function(ManufacturerService, Fancybox) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {

                    $scope.manRow = {
                        editName : {
                            editing: false,
                            title: $scope.man.name
                        }
                    };
                    $scope.saveTitle = function() {
                        ManufacturerService.setTitle($scope.manRow.editName.title, $scope.man.manufacturer_id).success(function() {
                            $scope.man.name = $scope.manRow.editName.title;
                            $scope.manRow.editName.editing = false;
                        });
                    };

                    $scope.remove = function(man) {
                        Fancybox.confirm("Confirm removing manufacturer","Remove manufacturer \"" + man.name + "\"?").then(function() {
                            $scope.removingMan = true;
                            ManufacturerService.remove(man.manufacturer_id).success(function() {
                                Cols.remove(man, $scope.list);
                            });

                        });
                    };

                }
            };
        }])

    ;

})();