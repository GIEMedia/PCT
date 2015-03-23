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

        .controller("report.detail.Ctrl", function ($scope, LayoutService) {
            LayoutService.setBreadCrumbs($scope, {
                sub: "Bayer: MaxForce Impact Roach Gel Bait",
                rootState: "report.list"
            });
        })


        .directive("customTableTests", function() {
            return {
                restrict: "C",
                link: function($scope, elem, attrs) {

                    elem.find('.table-row').on('mouseenter', function() {
                        if (!$(this).hasClass('expanded')) {
                            $(this).addClass('hovered');
                        }
                    }).on('mouseleave', function() {
                        $(this).removeClass('hovered');
                    });

                    elem.find('.table-row .inner').on('click', function () {
                        $(this).parent('.table-row').toggleClass('expanded').find('.table-row-expand').slideToggle(200);
                    });

                    elem.find('.table-row .inner').on('click', function () {
                        $(this).parent('.table-row').toggleClass('expanded').find('.table-row-expand').slideToggle(200);
                    });
                }
            };
        })

    ;

})();