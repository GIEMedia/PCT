"use strict";

(function () {

    angular.module('pct.management.courseEdit.information.categories', [
        'pct.fancybox'
    ])
        .directive("courseInformationCategories", ["$q", "CategoryService", "Fancybox", "modalPrompt", function($q, CategoryService, Fancybox, modalPrompt) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {

                    CategoryService.getList().success(function(categories) {
                        $scope.categories = categories;
                    });

                    //Cols.find($scope.cei.course.category
                    $scope.getCat = function(catId) {
                        return Cols.find($scope.categories, function(cat) { return cat.id == catId;});
                    };

                    $scope.$watch("cei.course != null && categories != null", function(v) {
                        if (v) {
                            setTimeout(function () { // This is to escape current digest cycle
                                $scope.$watch("cei.course.category", function(n, o) {
                                    if (n != o) {
                                        if (n == null) {
                                            $scope.cei.course.sub_category = null;
                                        } else if (Cols.find($scope.getCat($scope.cei.course.category).sub_categories, function(s) { return s.id == $scope.cei.course.sub_category;}) == null) {
                                            $scope.cei.course.sub_category = null;
                                        }
                                    }
                                });
                                if (!$scope.$$phase) $scope.$digest();
                            }, 0);
                        }
                    });

                    $scope.addNewCategory = function() {
                        addCategoryModal().then(function(newCat) {
                            var newCats = ObjectUtil.clone($scope.categories);
                            newCats.push(newCat);
                            $scope.categories = newCats;

                            $scope.cei.course.category = newCat.id;
                        });
                    };
                    $scope.addNewSubCategory = function() {
                        var cat = $scope.getCat($scope.cei.course.category);
                        addSubCategoryModal(cat.id).then(function(newSubCat) {
                            var newSubCats = ObjectUtil.clone(cat.sub_categories) || [];
                            newSubCats.push(newSubCat);
                            cat.sub_categories = newSubCats;

                            $scope.cei.course.sub_category = newSubCat.id;
                        });
                    };

                    function addCategoryModal() {
                        var defer = $q.defer();
                        modalPrompt.open("Add New Category", "Category name").result.then(function(newName) {
                            CategoryService.addCategory(newName).success(function(cat) {
                                defer.resolve(cat);
                            });
                        });
                        return defer.promise;
                    }
                    function addSubCategoryModal(parentId) {
                        var defer = $q.defer();
                        modalPrompt.open("Add New Sub Category", "Sub category name").result.then(function(newName) {
                            CategoryService.addSubCategory(parentId, newName).success(function(subCat) {
                                defer.resolve(subCat);
                            });
                        });
                        return defer.promise;
                    }
                }
            };
        }])
    ;
})();