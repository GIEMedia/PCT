"use strict";

(function () {

    angular.module('pct.management.courseEdit.sections.detail', [
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.sections.detail', {
                    url: '/:sectionId',
                    templateUrl: "/Areas/Management/app/spa/course_edit/sections/detail/SectionsDetail.html",
                    controller: "courseEdit.sections.detail.Ctrl"
                })
            ;
        })

        .controller("courseEdit.sections.detail.Ctrl", function ($scope, SectionService) {

        })
    ;

})();