"use strict";

(function () {

    angular.module('pct.management.layout', [
        'ui.router'
    ])

        .run(function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        })

        .config(function ($compileProvider) {
            if ($compileProvider.debugInfoEnabled) {
                $compileProvider.debugInfoEnabled(false);
            }
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider
                // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
                .otherwise("/login");
        })

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
                            state: "report.list",
                            icon: "test-o",
                            highlightOn: function(stateName) {
                                return stateName.indexOf("report.") == 0;
                            },
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

        .factory("LayoutService", function($http, $templateCache, $compile) {
            var layout = {};
            //var inform = function() {};

            var customFooterElem;
            var customFooterElemOriClass;

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
                },
                registerCustomFooter: function(elem) {
                    customFooterElem = elem;
                    customFooterElemOriClass = elem.attr("class");
                },
                setCustomFooter: function($scope, options) {

                    var templatePromise = $http.get(options.templateUrl, {cache: $templateCache}).then(function (result) {
                        return result.data;
                    });

                    var remove;
                    templatePromise.then(function(content) {
                        //var modalScope = $scope.$new();

                        var contentEl = $compile(angular.element(content))($scope);
                        customFooterElem.html(contentEl);
                        customFooterElem.show();

                        remove = function () {
                            //modalScope.$destroy();
                            customFooterElem.hide();
                            contentEl.remove();
                        };
                    });

                    $scope.$on("$destroy", function() {
                        if (remove) {
                            remove();
                            remove = null;
                        }
                    });

                    return {
                        setClass: function(styleClass) {
                            customFooterElem.attr("class", customFooterElemOriClass + (styleClass ? " " + styleClass : ""));
                        }
                    };
                }


                //hook : function($scope) {
                //    inform = function () {
                //        if (!$scope.$$phase) $scope.$digest();
                //        console.log("digest");
                //    };
                //}
            };
        })

        .directive("layoutCustomFooter", function(LayoutService) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    LayoutService.registerCustomFooter(elem);
                }
            };
        })

        .factory("WindowService", function() {
            var beforeUnloads = [];
            window.beforeUnload = function() {
                for (var i = 0; i < beforeUnloads.length; i++) {
                    var check = beforeUnloads[i]();
                    if (check != null) {
                        return check;
                    }
                }
                return null;
            };
            return {
                beforeUnload: function($scope, func) {
                    beforeUnloads.push(func);
                    $scope.$on("$destroy", function() {
                        Cols.remove(func, beforeUnloads);
                    });

                }
            };
        })
    ;

})();