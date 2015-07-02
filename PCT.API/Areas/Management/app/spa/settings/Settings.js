"use strict";

(function () {

    angular.module('pct.management.settings', [
        'pct.management.settings.manufacturer',
        'pct.management.settings.category'
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

        .controller("settings.Ctrl", ["$scope", function ($scope) {

        }])

    ;
})();