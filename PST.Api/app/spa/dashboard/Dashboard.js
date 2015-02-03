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

        .controller("dashboard.Ctrl", function ($scope, User, CourseService, DashboardHelper) {
            $scope.User = User;

            $scope.newCourses = CourseService.getNewCourses();
            $scope.openCourses = CourseService.getOpenCourses();
            var _courseStructure = CourseService.getCourseStructure();

            $scope.view = {
                search: null
            };

            $scope.$watch("view.search", function(search) {
                $scope.courseHeaderCols = DashboardHelper.toCols(DashboardHelper.filter(_courseStructure, search));
            });
        })

        .factory("DashboardHelper", function() {
            return {
                filter: function(_headers, search) {
                    if (StringUtil.isBlank(search)) {
                        return _headers;
                    }
                    var lowerSearch = search.toLowerCase();

                    var filterCat = function(cat) {
                        var courses = Cols.filter(cat.courses, function(course) {
                            return course.name.toLowerCase().indexOf(lowerSearch) > -1;
                        });
                        if (Cols.isEmpty(courses)) {
                            return null;
                        }

                        return {name: cat.name, courses: courses};
                    };


                    var headers = [];
                    for (var i = 0; i < _headers.length; i++) {
                        var categories = Cols.yield(_headers[i].categories, filterCat);

                        if (Cols.isEmpty(categories)) {
                            continue;
                        }

                        headers.push({name: _headers[i].name, categories: categories});
                    }
                    return headers;
                },
                toCols: function(list) {
                    if (Cols.isEmpty(list)) {
                        return null;
                    }
                    if (list.length == 1) {
                        return [[list[0]]];
                    }

                    var middle = Math.floor(list.length / 2);
                    return [list.slice(0, middle), list.slice(middle, list.length)];
                }
            };
        })

        .directive("searchField", function() {
            return {
                restrict: "C",
                scope: true,
                link: function($scope, elem, attrs) {

                    var $search = $('.search');

                    elem.on('click', function (e) {
                        $search.toggleClass('search-expanded');
                        $scope.clearSearchText();
                        e.preventDefault();
                    });

                    $('.wrapper').on('click', function(e) {
                        var $clicked = $(e.target);

                        if (!$clicked.closest($search).length && !$clicked.is($search)) {
                            $search.removeClass('search-expanded');
                            $scope.clearSearchText();
                        }
                    });
                },
                controller: function($scope) {
                    var ctrl = this;
                    ctrl.setClearTextF = function(clearTextF) {
                        $scope.clearSearchText = clearTextF;
                    };
                }

            };
        })

        .directive("searchInput", function() {
            return {
                require: ["ngModel", "^searchField"],
                link: function($scope, elem, attrs, ctrls) {
                    var ngModelCtrl = ctrls[0];
                    var searchFieldCtrl = ctrls[1];

                    searchFieldCtrl.setClearTextF(function() {
                        ngModelCtrl.$setViewValue('');
                        elem.val('');
                    });
                }
            };
        })
    ;

})();