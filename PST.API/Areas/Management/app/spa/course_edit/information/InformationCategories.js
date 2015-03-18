"use strict";

(function () {

    angular.module('pct.management.courseEdit.information.categories', [
    ])
        .directive("courseInformationCategories", function(CategoryService) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {

                    CategoryService.getList().success(function(categories) {
                        $scope.categories = categories;
                    });

                }
            };
        })
    ;

})();