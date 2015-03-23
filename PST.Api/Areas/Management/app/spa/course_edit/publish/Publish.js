"use strict";

(function () {

    angular.module('pct.management.courseEdit.publish', [
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.publish', {
                    url: '/publish',
                    templateUrl: "Areas/Management/app/spa/course_edit/publish/Publish.html",
                    controller: "courseEdit.publish.Ctrl"
                })
            ;
        })

        .controller("courseEdit.publish.Ctrl", function ($scope, $state, CourseService) {
            $scope.setCel({
                step: 4,
                save: function() {

                    var sending = ObjectUtil.clone($scope.course);

                    sending.status = $scope.editing.published ? 1 : 0;

                    return CourseService.upsert(sending).success(function() {
                        $scope.published = $scope.editing.published;
                        $scope.course.status = sending.status;
                    });
                },
                needSaving: function() {
                    return $scope.published != $scope.editing.published;
                }
            });

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
        })
    ;

})();