"use strict";

(function () {

    angular.module('pct.management.testResults', [
    ])
        .config(function ($stateProvider) {

            $stateProvider
                .state('testResults', {
                    url: '/testResults',
                    templateUrl: "/Areas/Management/app/spa/test_results/TestResults.html",
                    data: {
                        name: "Test Results"
                    },
                    controller: "testResults.Ctrl"
                })
            ;
        })

        .controller("testResults.Ctrl", function ($scope, LayoutService) {
            LayoutService.supportSearch($scope, {
                placeholder: "Search test result"
            });
        })
    ;

})();