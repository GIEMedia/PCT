"use strict";

(function () {

    angular.module('pct.management.courseEdit.sections.list', [
            'angularFileUpload'
    ])

        .config(["$stateProvider", function ($stateProvider) {
            $stateProvider
                .state('courseEdit.sections.list', {
                    url: '/list',
                    templateUrl: "Areas/Management/app/spa/course_edit/sections/list/SectionsList.html",
                    controller: "courseEdit.sections.list.Ctrl"
                })
            ;
        }])

        .controller("courseEdit.sections.list.Ctrl", ["$scope", "$state", "SectionService", function ($scope, $state, SectionService) {
            $scope.setCel({
                step: 1
            });

            $scope.inserting = {
                title: null,
                submitting: false
            };
            $scope.addSection = function() {
                $scope.inserting.submitting = true;
                SectionService.upsert({title: $scope.inserting.title}, $scope.course.id).success(function(section) {
                    $scope.sections.push(section);
                    $scope.inserting = {};
                    $scope.inserting.submitting = false;
                }).error(function() {
                    $scope.inserting.submitting = false;
                });
            };
            $scope.addSectionAndView = function() {
                SectionService.upsert($scope.inserting, $scope.course.id).success(function(section) {
                    $scope.sections.push(section);

                    $state.go("^.detail", {sectionId: section.id});
                });
            };

            $scope.updatingOrder = false;
            $scope.updateOrder = function(indice) {
                var ids = [];
                for (var i = 0; i < indice.length; i++) {
                    var index = indice[i];
                    ids.push($scope.sections[index].id);
                }
                $scope.updatingOrder = true;
                SectionService.setOrder(ids, $scope.course.id).success(function() {
                    
                    var newSections = [];
                    for (var i = 0; i < indice.length; i++) {
                        var index = indice[i];
                        newSections.push($scope.sections[index]);
                    }
                    $scope.sections = newSections;

                    $scope.updatingOrder = false;
                }).error(function() {
                    $scope.updatingOrder = false;
                });
            };
        }])

        .directive("sectionRow", ["SectionService", "Fancybox", function(SectionService, Fancybox) {
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

                    $scope.uploadingDocument = false;
                    $scope.uploadDocument = function(files) {
                        $scope.uploadingDocument = true;
                        SectionService.uploadDocument($scope.course.id, $scope.section.id, files[0])
                            .progress(function(ev) {
                                //console.log(ev);
                            })
                            .success(function(data) {
                                $scope.uploadingDocument = false;
                                $scope.refreshList();
                            })
                            .error(function() {
                                $scope.uploadingDocument = false;
                            })
                        ;
                    };

                    $scope.deleting = false;
                    $scope.deleteSection = function() {
                        Fancybox.confirm("Confirm deleting section", "Are you sure to delete this section?").then(function() {
                            $scope.deleting = true;
                            SectionService.delete($scope.course.id, $scope.section.id).success(function() {
                                $scope.deleting = false;
                                Cols.remove($scope.section, $scope.sections);
                            }).error(function() {
                                $scope.deleting = false;
                            });
                        });
                    };

                    $scope.deleteDocument = function() {
                        Fancybox.confirm("Confirm removing section's document", "Are you sure to remove this section's document?").then(function() {
                            SectionService.deleteDocument($scope.course.id, $scope.section.id)
                                .success(function() {
                                    $scope.section.document = null;
                                })
                            ;
                        });

                    }
                }
            };
        }])
    ;
})();