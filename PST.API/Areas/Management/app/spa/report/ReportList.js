"use strict";

(function () {

    angular.module('pct.management.report.list', [
    ])
        .config(function ($stateProvider) {

            $stateProvider
                .state('report.list', {
                    url: '/list',
                    templateUrl: "Areas/Management/app/spa/report/ReportList.html",
                    controller: "report.list.Ctrl"
                })
            ;
        })

        .controller("report.list.Ctrl", function ($scope, LayoutService) {
            LayoutService.supportSearch($scope, {
                placeholder: "Search"
            });
        })
    ;

})();