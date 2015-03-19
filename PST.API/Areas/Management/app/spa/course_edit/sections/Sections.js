"use strict";

(function () {

    angular.module('pct.management.courseEdit.sections', [
        'pct.management.courseEdit.sections.list'
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.sections', {
                    url: '/sections',
                    template: "<ui-view></ui-view>",
                    controller: "courseEdit.sections.Ctrl"
                })
            ;
        })

        .controller("courseEdit.sections.Ctrl", function ($scope, SectionService) {
            $scope.setCel({
                step: 1
            });


            $scope.$watch("course", function(course) {
                if (course) {
                    SectionService.getList(course.id).success(function(sections) {
                        $scope.sections = sections;
                    });
                }
            });

        })


        //.directive("iconRename", function() {
        //    return {
        //        restrict: "C",
        //        link: function($scope, elem, attrs) {
        //            elem.on('click', function (e) {
        //                var tr = elem.closest('tr');
        //                tr.addClass('editing');
        //                tr.find('.section-name .field').focus();
        //
        //                tr.find('.name-edit .fa').on('click', function (e) {
        //                    tr.removeClass('editing');
        //                    e.preventDefault();
        //                });
        //
        //                e.preventDefault();
        //            });
        //        }
        //    };
        //})
    ;

})();