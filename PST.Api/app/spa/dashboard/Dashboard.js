"use strict";

(function () {

    angular.module('pct.elearning.dashboard', [
        'ui.router'
    ])

        .config(function ($stateProvider) {

            $stateProvider
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: "/app/spa/dashboard/Dashboard.html",
                    controller: "dashboard.Ctrl"
                })
            ;
        })

        .controller("dashboard.Ctrl", function ($scope, User) {
            $scope.User = User;
        })


        .directive("searchField", function() {
            return {
                restrict: "C",
                link: function($scope, elem, attrs) {

                    var $search = $('.search');

                    elem.on('click', function (e) {
                        $search.toggleClass('search-expanded');
                        clearSearchText();
                        e.preventDefault();
                    });

                    var clearSearchText = function() {
                        $search.find('input').val('');
                    };

                    $('.wrapper').on('click', function(e) {
                        var $clicked = $(e.target);

                        if (!$clicked.closest($search).length && !$clicked.is($search)) {
                            $search.removeClass('search-expanded');
                            clearSearchText();
                        }
                    });
                }
            };
        })
    ;

})();