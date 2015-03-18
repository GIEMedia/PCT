"use strict";

(function () {

    angular.module('pct.management.courseEdit.sections', [
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.sections', {
                    url: '/sections',
                    templateUrl: "/Areas/Management/app/spa/course_edit/sections/Sections.html",
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

            $scope.inserting = {
                title: null
            };
            $scope.addSection = function() {
                SectionService.upsert($scope.inserting, $scope.course.id).success(function(section) {
                    $scope.sections.push(section);
                    $scope.inserting = {};
                });
            };

            $scope.deleteSection = function(section) {
                if (!confirm("Are you sure to delete this section?")) {
                    return;
                }
                SectionService.delete($scope.course.id, section.id).success(function() {
                    Cols.remove(section, $scope.sections);
                });
            }
        })

        .directive("pctFocus", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    $scope.$watch(attrs.pctFocus, function(value) {
                        if (value) {
                            setTimeout(function(){
                                elem.focus();
                            }, 0);
                        }
                    });
                }
            };
        })

        .directive("sectionRow", function(SectionService) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    $scope.editName = {
                        editing: false,
                        title: $scope.section.title
                    };
                    $scope.saveTitle = function() {
                        SectionService.setTitle($scope.editName.title, $scope.course.id, $scope.section.id).success(function() {
                            $scope.section.title = $scope.editName.title;
                            $scope.editName.editing = false;
                        });
                    }
                }
            };
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