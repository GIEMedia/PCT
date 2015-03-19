"use strict";

(function () {

    angular.module('pct.management.user.detail', [
    ])
        .config(function ($stateProvider) {

            $stateProvider
                .state('user.detail', {
                    url: '/detail',
                    templateUrl: "/Areas/Management/app/spa/user/UserDetail.html",
                    data: {
                        name: "User Information"
                    },
                    controller: "user.detail.Ctrl"
                })
            ;
        })

        .controller("user.detail.Ctrl", function ($scope, LayoutService) {
            LayoutService.setBreadCrumbs($scope, {
                sub: "Dave Hurt",
                rootState: "user.list"
            });
        })

        .directive("admin", function(Hover) {
            return {
                restrict: "C",
                link: Hover.link
            };
        })
        .directive("tableRowExpand", function(Hover) {
            return {
                restrict: "C",
                link: function($scope, elem, atrs) {
                    elem.find('.col-1 .inner').on('mouseenter', function() {
                        $(this).addClass('hovered');
                    }).on('mouseleave', function() {
                        $(this).removeClass('hovered');
                    });
                }
            };
        })
    ;

})();