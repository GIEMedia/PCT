"use strict";

(function () {

    angular.module('pct.management.settings', [
    ])
        .config(["$stateProvider", function ($stateProvider) {
            $stateProvider
                .state('settings', {
                    url: '/settings',
                    templateUrl: "Areas/Management/app/spa/settings/Settings.html",
                    data: {
                        name: "Settings"
                    },
                    controller: "settings.Ctrl"
                })
            ;
        }])

        .controller("settings.Ctrl", ["$scope", "Sorters", "LayoutService", "CategoryService", function ($scope, Sorters, LayoutService, CategoryService) {
            CategoryService.getList().success(function(list) {
                $scope.list = list;
            });

            $scope.summary = function() {
                if ($scope.list == null) {
                    return "Loading...";
                }

                var catCount = 0;
                var subCatCount = 0;
                Cols.each($scope.list, function(cat) {
                    catCount ++;

                    Cols.each(cat.sub_categories, function(cat) {
                        subCatCount ++;
                    });
                });

                return catCount + " Categories, " + subCatCount + " Sub Categories";
            }
        }])
    ;
})();