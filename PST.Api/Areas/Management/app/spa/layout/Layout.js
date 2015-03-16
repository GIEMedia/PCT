"use strict";

(function () {

    angular.module('pct.management.layout', [
    ])
        .directive("contentSideNav", function() {
            return {
                restrict: "E",
                templateUrl: "/Areas/Management/app/spa/layout/ContentSideNav.html",
                link: function($scope, elem, attrs) {
                    $scope.links = [
                        {
                            state: "courses",
                            icon: "course",
                            title: "Courses"
                        },
                        {
                            state: "testResults",
                            icon: "test-o",
                            title: "Test Results"
                        },
                        {
                            state: "users",
                            icon: "users",
                            title: "Users"
                        }
                    ];
                }
            };
        })
        .directive("contentHeaderSearch", function() {
            return {
                restrict: "E",
                templateUrl: "/Areas/Management/app/spa/layout/ContentHeaderSearch.html",
                link: function($scope, elem, attrs) {
                }
            };
        })
        .directive("layoutHeader", function(LayoutService, User, $state) {
            return {
                restrict: "A",
                templateUrl: "/Areas/Management/app/spa/layout/LayoutHeader.html",
                link: function($scope, elem, attrs) {
                    $scope.User = User;
                    $scope.layout = LayoutService.layout;

                    $scope.logout = function() {
                        User.loggedIn = false;
                        User.fullName = null;

                        $state.go("login");
                    };
                }
            };
        })

        .factory("LayoutService", function() {
            var layout = {};
            return {
                layout: layout,
                supportSearch: function($scope, options) {
                    layout.search = options;
                    $scope.$on("$destroy", function() {
                        layout.search = null;
                    });

                }
            };
        })
    ;

})();