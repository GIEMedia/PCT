"use strict";

(function () {

    angular.module('pct.management.courseEdit.information', [
        'pct.management.courseEdit.information.states',
        'pct.management.courseEdit.information.categories'
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

        .controller("courseEdit.information.Ctrl", function ($scope, $stateParams, $parse, $q, LayoutService, CourseService) {
            // Layout
            LayoutService.setBreadCrumbs($scope, {
                sub: "New",
                rootState: "courses"
            });

            $scope.setCel({
                step: 0,
                save: function() {
                    return CourseService.upsert($scope.cei.course).success(function(course) {
                        ObjectUtil.clear($scope.course);
                        ObjectUtil.copy(course, $scope.course);
                        $scope.cei.course = course;
                    });
                },
                needSaving: function() {
                    //console.log("compare: ===========");
                    //console.log($scope.course);
                    //console.log($scope.cei.course);
                    return !ObjectUtil.equals($scope.cei.course, $scope.course);
                }
            });

            $scope.cei = {
                course: null
            };
            $scope.$watch("course", function(value) {
                $scope.cei.course = ObjectUtil.clone(value);
            });

            // States
            $scope.addState = function(state) {
                $scope.cei.course.state_ceus.push(state);
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