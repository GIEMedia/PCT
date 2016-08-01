"use strict";

(function () {

    angular.module('pct.management.courses', [
        'pct.common.sorter'
    ])
        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('courses', {
                    url: '/courses',
                    templateUrl: "Areas/Management/app/spa/courses/Courses.html?v=" + htmlVer,
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

        .directive("courseRow", ["CourseService", "modalConfirm", function(CourseService, modalConfirm) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {

                    $scope.remove = function() {
                        modalConfirm.open("Confirm deleting course", "Are you sure to remove this course?").result.then(function() {
                            $scope.removing = true;
                            CourseService.delete($scope.course).success(function() {
                                Cols.remove($scope.course, $scope.list);
                            }).error(function() {
                                $scope.removing = false;
                            });
                        });
                    };
                }
            };
        }])
    ;

})();