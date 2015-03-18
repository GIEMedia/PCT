"use strict";

(function () {

    angular.module('pct.management.courseEdit.information.categories', [
        'pct.fancybox'
    ])
        .directive("courseInformationCategories", function($q, CategoryService, Fancybox) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {

                    CategoryService.getList().success(function(categories) {
                        $scope.categories = categories;
                    });

                    $scope.$watch("cei.course != null && categories != null", function(v) {
                        if (v) {
                            setTimeout(function () { // This is to escape current digest cycle
                                $scope.$watch("cei.course.category", function(n, o) {
                                    if (n != o) {
                                        $scope.cei.course.sub_category = null;
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
                        Fancybox.promptText("New category name").then(function(newName) {
                            CategoryService.addCategory(newName).success(function(cat) {
                                defer.resolve(cat);
                            });
                        });
                        return defer.promise;
                    }
                    function addSubCategoryModal(parentId) {
                        var defer = $q.defer();
                        Fancybox.promptText("New sub category name").then(function(newName) {

                            CategoryService.addSubCategory(parentId, newName).success(function(subCat) {
                                defer.resolve(subCat);
                            });
                        });
                        return defer.promise;
                    }
                }
            };
        })

    ;

})();