"use strict";

(function () {

    angular.module('pct.management.courseEdit.information', [
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.information', {
                    url: '/information',
                    templateUrl: "/Areas/Management/app/spa/course_edit/information/Information.html",
                    controller: "courseEdit.information.Ctrl"
                })
            ;
        })

        .controller("courseEdit.information.Ctrl", function ($scope, LayoutService, $stateParams, CourseService, CategoryService) {
            $scope.view = {

            };

            LayoutService.setBreadCrumbs($scope, {
                sub: "New",
                rootState: "courses"
            });

            $scope.setCel({
                step: 0,
                save: function() {}
            });


            if ($stateParams.courseId == "new") {
                $scope.course = {

                };
            } else {
                CourseService.get($stateParams.courseId).success(function(course) {
                    $scope.course = course;
                });
            }

            CategoryService.getList().success(function(categories) {
                $scope.categories = categories;
            });

            $scope.getCat = function(catId) {
                return Cols.find($scope.categories, function(cat) { return cat.id == catId;});
            };
        })
    ;

})();