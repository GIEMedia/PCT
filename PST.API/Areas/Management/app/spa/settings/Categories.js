"use strict";

(function () {

    angular.module('pct.management.settings.category', [
    ])
        .directive("settingsCategories", ["CategoryService", function(CategoryService) {
            return {
                restrict: "E",
                templateUrl: "Areas/Management/app/spa/settings/Categories.html",
                link: function($scope, elem, attrs) {
                    CategoryService.getList(true).success(function(list) {
                        $scope.list = list;
                    });

                    $scope.summary = function() {
                        if ($scope.list == null) {
                            return "Loading...";
                        }

                        var catCount = 0;
                        var subCatCount = 0;
                        Cols.each($scope.list, function(cat) {
                            catCount ++;

                            Cols.each(cat.sub_categories, function(cat) {
                                subCatCount ++;
                            });
                        });

                        return catCount + " Categories, " + subCatCount + " Sub Categories";
                    };
                }
            };
        }])



        .directive("settingsCatRow", ["CategoryService", "Fancybox", function(CategoryService, Fancybox) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {

                    $scope.catRow = {
                        editName : {
                            editing: false,
                            title: $scope.cat.title
                        }
                    };
                    $scope.saveTitle = function() {
                        CategoryService.setCatTitle($scope.catRow.editName.title, $scope.cat.id).success(function() {
                            $scope.cat.title = $scope.catRow.editName.title;
                            $scope.catRow.editName.editing = false;
                        });
                    };

                    $scope.removeCat = function(cat) {
                        Fancybox.confirm("Confirm removing category","Remove category \"" + cat.title + "\"?").then(function() {
                            $scope.removingCat = true;
                            CategoryService.deleteCategory(cat.id).success(function() {
                                Cols.remove(cat, $scope.list);
                            });

                        });
                    };

                    $scope.hasCourseCat = function(cat) {
                        return Cols.find(cat.sub_categories, function(sub) {
                                return sub.course_count == null || sub.course_count > 0;
                            }) != null;
                    };

                }
            };
        }])

        .directive("settingsSubCatRow", ["CategoryService", "Fancybox", function(CategoryService, Fancybox) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {

                    $scope.subRow = {
                        editName : {
                            editing: false,
                            title: $scope.sub.title
                        }
                    };
                    $scope.saveTitle = function() {
                        CategoryService.setSubCatTitle($scope.subRow.editName.title, $scope.sub.id, $scope.cat.id).success(function() {
                            $scope.sub.title = $scope.subRow.editName.title;
                            $scope.subRow.editName.editing = false;
                        });
                    };

                    $scope.removeSub = function(sub, cat) {
                        Fancybox.confirm("Confirm removing sub category", "Remove sub category \"" + sub.title + "\"?").then(function() {

                            $scope.removingSub = true;
                            CategoryService.deleteSubCategory(sub.id, cat.id).success(function() {
                                Cols.remove(sub, cat.sub_categories);
                            });

                        });
                    };
                }
            };
        }])
    ;

})();