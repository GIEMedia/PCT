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

        .controller("user.Ctrl", function($scope, LayoutService) {
            LayoutService.supportSearch($scope, {
                placeholder: "Search"
            });
        })


    ;

})();