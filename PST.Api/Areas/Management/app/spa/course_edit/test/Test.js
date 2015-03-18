"use strict";

(function () {

    angular.module('pct.management.courseEdit.test', [
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.test', {
                    url: '/test',
                    templateUrl: "/Areas/Management/app/spa/course_edit/test/Test.html",
                    controller: "courseEdit.test.Ctrl"
                })
            ;
        })

        .controller("courseEdit.test.Ctrl", function ($scope, LayoutService) {
            $scope.setCel({
                step: 2,
                save: null
            });
        })
    ;

})();