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
                save: function() {
                    CourseService.upsert($scope.course).success(function(course) {
                        ObjectUtil.clear($scope.course);
                        ObjectUtil.copy(course, $scope.course);
                    });
                }
            });

            $scope.view = {

            };

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
            $scope.addState = function(state) {
                console.log(state);
                $scope.course.state_ceus.push(state);
            };

            $scope.getCat = function(catId) {
                return Cols.find($scope.categories, function(cat) { return cat.id == catId;});
            };


            CourseService.getList().success(function(list) {
                $scope.courses = list;
            });
        })
    ;

})();