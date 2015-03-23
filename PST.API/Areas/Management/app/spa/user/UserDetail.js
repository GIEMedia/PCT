"use strict";

(function () {

    angular.module('pct.management.user.detail', [
    ])
        .config(function ($stateProvider) {

            $stateProvider
                .state('user.detail', {
                    url: '/:userId',
                    templateUrl: "Areas/Management/app/spa/user/UserDetail.html",
                    data: {
                        name: "User Information"
                    },
                    controller: "user.detail.Ctrl"
                })
            ;
        })

        .controller("user.detail.Ctrl", function ($scope, $stateParams, LayoutService, UserService, StateService) {
            UserService.getDetail($stateParams.userId).success(function( detail ) {
                $scope.detail = detail;

                LayoutService.setBreadCrumbs($scope, {
                    sub: detail.first_name + " " + detail.last_name,
                    rootState: "user.list"
                });
            });

            $scope.stateByCode = StateService.stateByCode;

            $scope.percent = function(value) {
                return Math.round(value * 100);
            };

            function setAdminAccess(value) {
                UserService.setAdminAccess($stateParams.userId, value).success(function () {
                    $scope.detail.admin_access = value;
                });
            }

            $scope.demote = function() {
                setAdminAccess(0);
            };
            $scope.promote = function() {
                setAdminAccess(1);
            };
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