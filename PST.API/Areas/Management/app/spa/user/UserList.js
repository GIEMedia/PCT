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
            UserService.getList().success(function(list) {
                $scope.users = list;
            });
        })
    ;

})();