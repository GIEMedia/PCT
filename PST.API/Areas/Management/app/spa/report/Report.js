"use strict";

(function () {

    angular.module('pct.management.report', [
        'pct.management.report.list',
        'pct.management.report.detail'
    ])
        .config(function ($stateProvider) {

            $stateProvider
                .state('report', {
                    url: '/report',
                    template: "<ui-view></ui-view>",
                    abstract: true,
                    data: {
                        name: "Test Results"
                    },
                    controller: "report.Ctrl"
                })
            ;
        })

        .controller("report.Ctrl", function ($scope, Sorters, LayoutService, CourseService) {
            $scope.r = {
                search: null
            };

            $scope.sorter = Sorters.create();

            CourseService.getList().success(function(list) {
                $scope.courses = list;
            });
        })
    ;

})();