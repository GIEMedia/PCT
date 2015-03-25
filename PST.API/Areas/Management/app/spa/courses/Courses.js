"use strict";

(function () {

    angular.module('pct.management.courses', [
        'pct.common.sorter'
    ])
        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('courses', {
                    url: '/courses',
                    templateUrl: "Areas/Management/app/spa/courses/Courses.html",
                    data: {
                        name: "Courses"
                    },
                    controller: "courses.Ctrl"
                })
            ;
        }])

        .controller("courses.Ctrl", ["$scope", "LayoutService", "CourseService", "Sorters", function ($scope, LayoutService, CourseService, Sorters) {
            $scope.view = {
                search: null
            };

            LayoutService.supportSearch($scope, {
                placeholder: "Search",
                model: "view.search"
            });

            CourseService.getList().success(function(list) {
                $scope.list = list;
            });

            $scope.sorter = Sorters.create();
        }])

        .directive("courseRow", ["CourseService", function(CourseService) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {

                    $scope.remove = function() {
                        if (!confirm("Are you sure to remove this course?")) {
                            return;
                        }
                        $scope.removing = true;
                        CourseService.delete($scope.course).success(function() {
                            Cols.remove($scope.course, $scope.list);
                        }).error(function() {
                            $scope.removing = false;
                        });
                    };
                }
            };
        }])
    ;

})();