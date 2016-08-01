"use strict";

(function () {

    angular.module("pct.elearning.course.document-viewer", [
    ])
        .directive("courseDocumentViewer", function() {
            return {
                restrict: "E",
                scope: {
                    section: "="
                },
                templateUrl: "app/spa/course/document-viewer/document-viewer.html?v=" + htmlVer,
                link: function($scope, elem, attrs) {
                },
                controller: ["$scope", function ($scope) {

                    $scope.currentPage = function() {
                        if ($scope.section==null || $scope.section.document.pages == null) {
                            return 1;
                        }
                        return $scope.section.document.pages.indexOf($scope.page) + 1;
                    };


                    $scope.page = null;
                    $scope.$watch("section", function(value) {
                        if (value && $scope.section.document.pages) {
                            $scope.page = $scope.section.document.pages[0];
                        }
                    });

                    $scope.nextPage = function() {
                        var indexOf = $scope.section.document.pages.indexOf($scope.page);
                        if (indexOf >= $scope.section.document.pages.length - 1) {
                            return;
                        }
                        $scope.page = $scope.section.document.pages[indexOf + 1];
                        return false;
                    };
                    $scope.prevPage = function() {
                        var indexOf = $scope.section.document.pages.indexOf($scope.page);
                        if (indexOf == 0) {
                            return;
                        }
                        $scope.page = $scope.section.document.pages[indexOf - 1];
                        return false;
                    };
                }]
            };
        })
    ;

})();