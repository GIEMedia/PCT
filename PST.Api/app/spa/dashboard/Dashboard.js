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
                $scope.courseHeaderCols = DashboardHelper.toCols(DashboardHelper.filter(_courseStructure));
            });
        })

        .factory("DashboardHelper", function() {

            return {
                filter: function(headers) {
                    return headers;
                },
                toCols: function(list) {
                    return [[list[0]], [list[1]]];
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