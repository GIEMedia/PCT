"use strict";

(function () {

    angular.module('pct.management.courseEdit.sections', [
        'pct.management.courseEdit.sections.list',
        'pct.management.courseEdit.sections.detail'
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.sections', {
                    url: '/sections',
                    template: "<ui-view></ui-view>",
                    abstract: true,
                    controller: "courseEdit.sections.Ctrl"
                })
            ;
        })

        .controller("courseEdit.sections.Ctrl", function ($scope, $state, SectionService) {
            $scope.$watch("course", function(course) {
                if (course) {
                    SectionService.getList(course.id).success(function(sections) {
                        $scope.sections = sections;
                    });
                }
            });

        })
    ;

})();