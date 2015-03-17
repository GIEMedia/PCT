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
                            highlightOn: function(stateName) {
                                return stateName.indexOf("course") == 0;
                            },
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
        .directive("layoutHeader", function(LayoutService, SecurityService, User, $parse) {
            return {
                restrict: "A",
                templateUrl: "/Areas/Management/app/spa/layout/LayoutHeader.html",
                link: function($scope, elem, attrs) {
                    $scope.chs = {
                        search: null
                    };

                    $scope.User = User;
                    $scope.layout = LayoutService.layout;

                    $scope.logout = function() {
                        SecurityService.logout();
                    };

                    var applySearch = null;
                    $scope.$watch("layout.search", function(value) {
                        $scope.chs.search = null;

                        if (value) {
                            var model = $parse(value.options.model);

                            applySearch = function(searchValue) {
                                value.scope.$applyAsync(function() {
                                    model.assign(value.scope, searchValue);
                                });
                            };
                        } else {
                            applySearch = null;
                        }
                    });

                    $scope.$watch("chs.search", function(value) {
                        if (applySearch) applySearch(value);
                    });
                }
            };
        })

        .factory("LayoutService", function() {
            var layout = {};
            //var inform = function() {};
            return {
                layout: layout,
                supportSearch: function($scope, options) {
                    layout.search = {
                        scope: $scope,
                        options: options
                    };
                    $scope.$on("$destroy", function() {
                        layout.search = null;
                    });
                },
                setBreadCrumbs: function($scope, breadcrumbs) {
                    layout.breadcrumbs = breadcrumbs;
                    $scope.$on("$destroy", function() {
                        layout.breadcrumbs = null;
                    });
                }
                //hook : function($scope) {
                //    inform = function () {
                //        if (!$scope.$$phase) $scope.$digest();
                //        console.log("digest");
                //    };
                //}
            };
        })
    ;

})();