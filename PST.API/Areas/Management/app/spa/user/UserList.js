"use strict";

(function () {

    angular.module('pct.management.user.list', [
    ])
        .config(function ($stateProvider) {

            $stateProvider
                .state('user.list', {
                    url: '/list',
                    templateUrl: "Areas/Management/app/spa/user/UserList.html",
                    data: {
                        name: "Users"
                    },
                    controller: "user.list.Ctrl"
                })
            ;
        })

        .controller("user.list.Ctrl", function ($scope, LayoutService, UserService) {
            $scope.ul = {
                users: null,
                pageCount: null,
                pageNumbers: null,
                pageNum: 1
            };

            $scope.$watch("ul.pageNum", function(value) {
                $scope.ul.users = null;
                UserService.getList(value).success(function(resp) {
                    $scope.ul.pageCount = resp.pages + 1;
                    $scope.ul.users = resp.results;
                });
            });

            $scope.$watch("ul.pageCount", function(pageCount) {
                $scope.ul.pageNumbers = [];
                for (var i = 0; i < pageCount; i++) {
                    $scope.ul.pageNumbers[i] = i+1;
                }
            });

        })
    ;

})();