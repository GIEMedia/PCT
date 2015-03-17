"use strict";

(function () {

    angular.module('pct.management.courseEdit.information', [
        'pct.management.courseEdit.information.states'
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

        .controller("courseEdit.information.Ctrl", function ($scope, LayoutService, $stateParams, CourseService, CategoryService, StateService) {
            // Layout
            LayoutService.setBreadCrumbs($scope, {
                sub: "New",
                rootState: "courses"
            });

            $scope.setCel({
                step: 0,
                save: function() {}
            });

            $scope.view = {

            };

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

            // States
            $scope.states = StateService.getStates();

            $scope.stateByCode = function(code) {
                return Cols.find($scope.states, function (e) {
                    return e.code == code;
                });
            };

            $scope.getCat = function(catId) {
                return Cols.find($scope.categories, function(cat) { return cat.id == catId;});
            };
        })
    ;

})();