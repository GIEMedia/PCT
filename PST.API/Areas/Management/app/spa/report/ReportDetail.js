"use strict";

(function () {

    angular.module('pct.management.report.detail', [
    ])
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider
                .state('report.detail', {
                    url: '/:courseId',
                    templateUrl: "Areas/Management/app/spa/report/ReportDetail.html",
                    controller: "report.detail.Ctrl"
                })
            ;
        }])

        .controller("report.detail.Ctrl", ['$scope', '$stateParams', 'LayoutService', 'ReportService', function ($scope, $stateParams, LayoutService, ReportService) {
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


            $scope.isMultipleCorrect = function(question) {
                if (question.options==null) {
                    return false;
                }

                return Cols.filter(question.options, function(o) {
                        return o.correct;
                    }).length >= 2;
            };
        }])

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

                    function total(a) {
                        return a.first_attempt + a.second_attempt + a.third_attempt;
                    }

                    $scope.percent = function(value, a) {
                        return Math.round(value / total(a) * 100);
                    }
                }
            };
        })
    ;
})();