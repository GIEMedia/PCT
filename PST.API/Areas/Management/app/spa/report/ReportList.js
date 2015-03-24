"use strict";

(function () {

    angular.module('pct.management.report.list', [
    ])
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider
                .state('report.list', {
                    url: '/list',
                    templateUrl: "Areas/Management/app/spa/report/ReportList.html",
                    controller: "report.list.Ctrl"
                })
            ;
        }])

        .controller("report.list.Ctrl", ['$scope', 'LayoutService', function ($scope, LayoutService) {
            LayoutService.supportSearch($scope, {
                placeholder: "Search",
                model: "r.search"
            });
        }])

        .factory("pctMomentFilter", function() {
            return function(dateStr) {
                if (dateStr == "0001-01-01T00:00:00") {
                    return "Never";
                }
                //return moment(new Date().getTime() - (Math.random() * 4 * DateUtil.DAY_LENGTH) ).fromNow()
                return moment( dateStr ).fromNow()
                    .replace("a year", "1 yr")
                    .replace("years", "yrs")
                    .replace("a month", "1 mo")
                    .replace("months", "mo")
                    .replace("a day", "1d")
                    .replace(" days", "d")
                    .replace("a minute", "1m")
                    .replace(" minutes", "m")
                    .replace("an hour", "1h")
                    .replace(" hours", "h")
                    .replace("a day ago", "yesterday")
                    ;
            }
        })
    ;
})();