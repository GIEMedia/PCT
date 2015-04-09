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

        .controller("settings.Ctrl", ["$scope", "Sorters", "LayoutService", "CourseService", function ($scope, Sorters, LayoutService, CourseService) {

        }])
    ;
})();