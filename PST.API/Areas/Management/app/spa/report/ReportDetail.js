"use strict";

(function () {

    angular.module('pct.management.report.detail', [
    ])
        .config(function ($stateProvider) {

            $stateProvider
                .state('report.detail', {
                    url: '/:courseId',
                    templateUrl: "Areas/Management/app/spa/report/ReportDetail.html",
                    controller: "report.detail.Ctrl"
                })
            ;
        })

        .controller("report.detail.Ctrl", function ($scope, $stateParams, LayoutService, ReportService) {
            $scope.$watch("courses", function(value) {
                if (value) {
                    LayoutService.setBreadCrumbs($scope, {
                        sub: Cols.find(value, function(c) { return c.id== $stateParams.courseId;}).title,
                        rootState: "report.list"
                    });
                }
            });

            ReportService.getResult($stateParams.courseId).success(function(questions) {
                $scope.questions = questions;
            });
        })

        .directive("reportRow", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    elem.on('mouseenter', function() {
                        if (!$(this).hasClass('expanded')) {
                            $(this).addClass('hovered');
                        }
                    }).on('mouseleave', function() {
                        $(this).removeClass('hovered');
                    });

                    elem.find('.inner').on('click', function () {
                        $(this).parent('.table-row').toggleClass('expanded').find('.table-row-expand').slideToggle(200);
                    });

                    $scope.percent = function(value) {
                        var total = $scope.question.first_attempt + $scope.question.second_attempt + $scope.question.third_attempt;
                        return Math.round(value / total * 100);
                    }
                }
            };
        })

    ;

})();