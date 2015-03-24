"use strict";

(function () {

    angular.module('pct.management.courseEdit.information', [
        'pct.management.courseEdit.information.states',
        'pct.management.courseEdit.information.categories'
    ])

        .config(["$stateProvider", function ($stateProvider) {
            $stateProvider
                .state('courseEdit.information', {
                    url: '/information',
                    templateUrl: "Areas/Management/app/spa/course_edit/information/Information.html",
                    controller: "courseEdit.information.Ctrl"
                })
            ;
        }])

        .controller("courseEdit.information.Ctrl", ["$scope", "$state", "$stateParams", "$parse", "$q", "LayoutService", "CourseService", function ($scope, $state, $stateParams, $parse, $q, LayoutService, CourseService) {
            // Layout

            $scope.$watch("course", function(course) {
                $scope.cei.course = ObjectUtil.clone(course);
            });

            $scope.setCel({
                step: 0,
                save: function() {
                    var defer = $q.defer();
                    if (StringUtil.isEmpty($scope.cei.course.title)) {
                        defer.reject("Please provide course's title");
                    } else if (StringUtil.isEmpty($scope.cei.course.sub_category)) {
                        defer.reject("Please provide course's sub category");
                    } else {
                        CourseService.upsert($scope.cei.course).success(function(course) {
                            ObjectUtil.clear($scope.course);
                            ObjectUtil.copy(course, $scope.course);
                            $scope.cei.course = course;
                            defer.resolve();
                        });
                    }
                    return defer.promise;

                },
                needSaving: function() {
                    return !ObjectUtil.equals($scope.cei.course, $scope.course);
                }
            });

            $scope.cei = {
                course: null
            };

            // States

            $scope.getCat = function(catId) {
                return Cols.find($scope.categories, function(cat) { return cat.id == catId;});
            };

            CourseService.getList().success(function(list) {

                $scope.prerequisites = Cols.filter(list, function(e) {
                    return e.id != $stateParams.courseId;
                });
            });
        }])
    ;
})();