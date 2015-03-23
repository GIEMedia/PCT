"use strict";

(function () {

    angular.module('pct.management.user', [
        'pct.management.user.list',
        'pct.management.user.detail'
    ])
        .config(function ($stateProvider) {

            $stateProvider
                .state('user', {
                    url: '/user',
                    template: "<ui-view></ui-view>",
                    abstract: true,
                    controller: "user.Ctrl"
                })
            ;
        })

        .controller("user.Ctrl", function($scope, $state, $rootScope, LayoutService, UserService) {
            $scope.u = {
                search: null,
                searching: null
            };
            LayoutService.supportSearch($scope, {
                placeholder: "Search",
                model: "u.search"
            });

            $scope.$watch("u.search", function(value) {
                if (value == null || value.length < 2) {
                    $scope.u.searching = null;
                } else {
                    var searching = {};
                    $scope.u.searching = searching;
                    UserService.search(value).success(function(list) {
                        searching.result = list;
                    });
                    if ($state.current.name == "user.detail") {
                        $state.go("^.list");
                    }
                }
            });

            $scope.toDetail = function(userId) {
                $scope.u.search = null;
                $scope.u.searching = null;
                $state.go("user.detail", {userId: userId});
            }

        })


    ;

})();