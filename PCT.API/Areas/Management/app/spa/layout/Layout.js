"use strict";

(function () {

    angular.module('pct.management.layout', [
        'ui.router'
    ])

        .run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }])

        .config(["$compileProvider", function ($compileProvider) {
            if ($compileProvider.debugInfoEnabled) {
                $compileProvider.debugInfoEnabled(false);
            }
        }])

        .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider
                // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
                .otherwise("/login");
        }])

        /**
         * Shows the left hand side navigation panel with navigation links.
         * This also helps highlight links of active pages
         */
        .directive("contentSideNav", ["LayoutService", function(LayoutService) {
            return {
                restrict: "E",
                templateUrl: "Areas/Management/app/spa/layout/ContentSideNav.html",
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
                            state: "settings",
                            icon: "settings",
                            title: "Settings"
                        },
                        {
                            state: "user.list",
                            icon: "users",
                            highlightOn: function(stateName) {
                                return stateName.indexOf("user.") == 0;
                            },
                            title: "Users"
                        }
                    ];

                    $scope.profileLink = LayoutService.profileLink;
                }
            };
        }])

        /**
         * This simply include the search box into layoutHeader.
         * No link or controller is needed as scope is shared with the layoutHeader directive
         */
        .directive("contentHeaderSearch", function() {
            return {
                restrict: "E",
                templateUrl: "Areas/Management/app/spa/layout/ContentHeaderSearch.html"
            };
        })

        /**
         * Show the header, with search box and logout link
         */
        .directive("layoutHeader", ["LayoutService", "SecurityService", "User", "$parse", function(LayoutService, SecurityService, User, $parse) {
            return {
                restrict: "A",
                templateUrl: "Areas/Management/app/spa/layout/LayoutHeader.html",
                link: function($scope, elem, attrs) {
                    // chs means Content Header Search. This helps prevent shadowing in child scopes
                    $scope.chs = {
                        search: null
                    };

                    // Links to User object to show User's name on header
                    $scope.User = User;

                    $scope.logout = function() {
                        SecurityService.logout();
                    };

                    // This links layout object from LayoutService to this scope's layout property.
                    $scope.layout = LayoutService.layout;

                    // This allows configuration from LayoutService to take effect in this header's dom.
                    var applySearch = null;
                    $scope.$watch("layout.search", function(value) {
                        $scope.chs.search = null;

                        if (value) {
                            var model = $parse(value.options.model);

                            applySearch = function(searchValue) {
                                // Schedule a digest cycle in the target (configured) scope
                                value.scope.$applyAsync(function() {
                                    // Apply the search value to the configured model in target scope
                                    model.assign(value.scope, searchValue);
                                });
                            };

                            // 2-way link to reflect target model value to this search box's value
                            value.scope.$watch(value.options.model, function(value) {
                                $scope.chs.search = value;
                            });
                        } else {
                            // When no search component is registered, the search box will disappear and
                            // no applySearch function is available.
                            applySearch = null;
                        }
                    });

                    $scope.$watch("chs.search", function(value) {
                        if (applySearch) applySearch(value);
                    });
                }
            };
        }])

        /**
         * Provide to page's controllers all services relating layout: header search box, header bread crumbs
         * and custom footer
         */
        .provider("LayoutService", function() {
            var _profileLink;

            // This is to be called by app.js to configure external link to user's profile page (in Elearning system)
            this.setProfileLink = function(profileLink) {
                _profileLink = profileLink;
            };

            this.$get = ["$http", "$templateCache", "$compile", function($http, $templateCache, $compile) {
                var layout = {};

                var customFooterElem;
                var customFooterElemOriClass;

                return {
                    /**
                     * Provide link for Layout Header directive
                     */
                    layout: layout,
                    profileLink: _profileLink,

                    /**
                     * Page's controllers will use this function to register its model to layout's search box.
                     * For example:
                     * <pre>
                     *     $scope.view = {
                     *         search: null
                     *     };
                     *
                     *     LayoutService.supportSearch($scope, {
                     *         placeholder: "Search",
                     *         model: "view.search"
                     *     });
                     * </pre>
                     * @param $scope
                     * @param options
                     */
                    supportSearch: function($scope, options) {
                        layout.search = {
                            scope: $scope,
                            options: options
                        };
                        $scope.$on("$destroy", function() {
                            layout.search = null;
                        });
                    },

                    /**
                     * Page's controllers will use this function to show bread crumbs on header. For example:
                     * <pre>
                     *     LayoutService.setBreadCrumbs($scope, {
                     *         sub: "PCT Pest Insecticide",
                     *         rootState: "courses"
                     *     })
                     * </pre>
                     * Will show this: "Courses / PCT Pest Insecticide" with a link to the "courses" state
                     * @param $scope
                     * @param breadcrumbs
                     */
                    setBreadCrumbs: function($scope, breadcrumbs) {
                        layout.breadcrumbs = breadcrumbs;
                        $scope.$on("$destroy", function() {
                            layout.breadcrumbs = null;
                        });
                    },

                    /**
                     * To be called by layoutCustomFooter directive
                     * @param elem
                     */
                    registerCustomFooter: function(elem) {
                        customFooterElem = elem;
                        customFooterElemOriClass = elem.attr("class");
                    },

                    /**
                     * Page's controllers will use this function to show footer - This footer stays as a part of the
                     * layout html so can not be in page's html.
                     * For example:
                     *     LayoutService.setCustomFooter( $scope, { templateUrl: "*.html" } )
                     *
                     * @param $scope
                     * @param options
                     * @returns {{setClass: Function}}
                     */
                    setCustomFooter: function($scope, options) {

                        var templatePromise = $http.get(options.templateUrl, {cache: $templateCache}).then(function (result) {
                            return result.data;
                        });

                        var remove;
                        templatePromise.then(function(content) {

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

                        // Returns the control to this custom footer, so caller can change footer div's class later
                        return {
                            setClass: function(styleClass) {
                                customFooterElem.attr("class", customFooterElemOriClass + (styleClass ? " " + styleClass : ""));
                            }
                        };
                    }

                };
            }];
        })

        .directive("layoutCustomFooter", ["LayoutService", function(LayoutService) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    LayoutService.registerCustomFooter(elem);
                }
            };
        }])

        /**
         * This allow page controller to do custom check when the tab is closed to change url (by user).
         * A custom message can be shown to warn user of unsaved data will be lost.
         */
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