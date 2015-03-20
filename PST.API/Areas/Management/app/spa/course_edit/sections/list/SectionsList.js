"use strict";

(function () {

    angular.module('pct.management.courseEdit.sections.list', [
            'angularFileUpload'
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.sections.list', {
                    url: '/list',
                    templateUrl: "/Areas/Management/app/spa/course_edit/sections/list/SectionsList.html",
                    controller: "courseEdit.sections.list.Ctrl"
                })
            ;
        })
        
        

        .controller("courseEdit.sections.list.Ctrl", function ($scope, $state, SectionService) {
            $scope.sectionLayout({
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
            $scope.addSectionAndView = function() {
                SectionService.upsert($scope.inserting, $scope.course.id).success(function(section) {
                    $scope.sections.push(section);

                    $state.go("^.detail", {sectionId: section.id});
                });
            };

            $scope.deleteSection = function(section) {
                if (!confirm("Are you sure to delete this section?")) {
                    return;
                }
                SectionService.delete($scope.course.id, section.id).success(function() {
                    Cols.remove(section, $scope.sections);
                });
            };
            
            $scope.updateOrder = function(indice) {
                var ids = [];
                for (var i = 0; i < indice.length; i++) {
                    var index = indice[i];
                    ids.push($scope.sections[index].id);
                }
                SectionService.setOrder(ids, $scope.course.id).success(function() {
                    
                    var newSections = [];
                    for (var i = 0; i < indice.length; i++) {
                        var index = indice[i];
                        newSections.push($scope.sections[index]);
                    }
                    $scope.sections = newSections;
                });
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
                    };
                    
                    $scope.uploadDocument = function(files) {
                        SectionService.uploadDocument($scope.course.id, $scope.section.id, files[0])
                            .progress(function(ev) {
                                console.log(ev);
                            })
                            .success(function(data) {
                                console.log(data);
                            })
                        ;
                    };
                    $scope.deleteDocument = function() {
                        SectionService.deleteDocument($scope.course.id, $scope.section.id)
                            .success(function() {
                                $scope.section.document = null;
                            })
                        ;
                    }
                }
            };
        })

        .directive("sortable", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    elem.sortable({
                        handle: ".sortable-handle",
                        items: "[sortable-row]",
                        update: function() {
                            var indice = [];
                            elem.find("tr[sortable-row]").each(function() {
                                indice.push($(this).attr("sortable-row") * 1);
                            });
                            $scope.$applyAsync(function() {
                                $scope.$eval(attrs.sortable, {"$indice": indice});
                            });
                        }
                    });
                }
            };
        })
    ;

})();