"use strict";

(function () {

    angular.module('pct.management.courses', [
        'pct.common.sorter'
    ])
        .config(function ($stateProvider) {

            $stateProvider
                .state('courses', {
                    url: '/courses',
                    templateUrl: "/Areas/Management/app/spa/courses/Courses.html",
                    data: {
                        name: "Courses"
                    },
                    controller: "courses.Ctrl"
                })
            ;
        })

        .controller("courses.Ctrl", function ($scope, LayoutService, CourseService, Sorters) {
            $scope.view = {
                search: null
            };

            LayoutService.supportSearch($scope, {
                placeholder: "Search course",
                model: "view.search"
            });

            CourseService.getList().success(function(list) {
                $scope.list = list;
            });

            $scope.sorter = Sorters.create();
        })
    ;

})();