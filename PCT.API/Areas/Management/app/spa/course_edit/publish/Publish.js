"use strict";

(function () {

    angular.module('pct.management.courseEdit.publish', [
    ])

        .config(["$stateProvider", function ($stateProvider) {
            $stateProvider
                .state('courseEdit.publish', {
                    url: '/publish',
                    templateUrl: "Areas/Management/app/spa/course_edit/publish/Publish.html?v=" + htmlVer,
                    controller: "courseEdit.publish.Ctrl"
                })
            ;
        }])

        .controller("courseEdit.publish.Ctrl", ["$scope", "$state", "CourseService", function ($scope, $state, CourseService) {
            $scope.setCel({
                step: 4,
                save: function() {
                    var status = $scope.editing.published ? 1 : 0;

                    return CourseService.setStatus($scope.course.id, status).success(function() {
                        $scope.published = $scope.editing.published;
                        $scope.course.status = status;
                    });
                },
                canSave: function() {
                    return !$scope.editing.published || $scope.p.valid;
                },
                needSaving: function() {
                    return $scope.published != $scope.editing.published;
                }
            });

            $scope.p = {
                valid: false
            };

            $scope.publishing = [
                {
                    active: false,
                    display: "Inactive"
                },
                {
                    active: true,
                    display: "Active"
                }
            ];
            $scope.published = false;
            $scope.editing = {
                published: false
            };

            $scope.$watch("course", function(value) {
                if (value) {
                    if (value.status == 1) {
                        $scope.published = true;
                        $scope.editing.published = true;
                    }
                }
            });
        }])
    ;
})();