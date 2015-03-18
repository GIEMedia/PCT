"use strict";

(function () {

    angular.module('pct.management.courseEdit.publish', [
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.publish', {
                    url: '/publish',
                    templateUrl: "/Areas/Management/app/spa/course_edit/publish/Publish.html",
                    controller: "courseEdit.publish.Ctrl"
                })
            ;
        })

        .controller("courseEdit.publish.Ctrl", function ($scope, LayoutService) {
            $scope.setCel({
                step: 4,
                save: null
            });
        })
    ;

})();