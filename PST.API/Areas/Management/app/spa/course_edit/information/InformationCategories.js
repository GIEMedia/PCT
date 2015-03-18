"use strict";

(function () {

    angular.module('pct.management.courseEdit.information.categories', [
    ])
        .directive("courseInformationCategories", function($q, CategoryService, Modals) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {

                    CategoryService.getList().success(function(categories) {
                        $scope.categories = categories;
                    });

                    $scope.$watch("cei.course != null && categories != null", function(value) {
                        if (value) {
                            $scope.$watch("cei.course.category", function(value) {
                                $scope.cei.course.sub_category = null;
                            });
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

                    function addCategoryModal() {
                        var defer = $q.defer();
                        Modals.promptText("New category name").then(function(newName) {

                            CategoryService.addCategory(newName).then(function(resp) {
                                defer.resolve(resp.data);
                            });
                        });
                        return defer.promise;
                    }
                }
            };
        })

        .factory("Modals", function($q, $compile, $templateCache, $http, $controller, $rootScope) {
            var open = function($scope, options) {
                //options.templateUrl
                var templatePromise = $http.get(options.templateUrl, {cache: $templateCache}).then(function (result) {
                    return result.data;
                });

                var closeListeners = [];
                templatePromise.then(function(content) {

                    var invokeCloseListeners = function() {
                        Fs.invokeAll(closeListeners);
                        closeListeners = [];
                    };

                    var close = function () {
                        $.fancybox.close();
                    };
                    $controller(options.controller, {'$scope': $scope, "$modalInstance": { close: close, dismiss: close }});
                    var contentEl = $compile(angular.element(content))($scope);

                    var fancybox = $.fancybox({
                        content: contentEl,
                        maxWidth: 750,
                        width: 'auto',
                        height: 'auto',
                        fitToView: false,
                        autoSize: false,
                        afterClose: invokeCloseListeners,
                        closeClick: false
                    });

                    $scope.$on("$destroy", close);

                });

                return {
                    onClose: function(cl) {
                        closeListeners.push(cl);
                    }
                };

            };

            return {
                open: open,
                promptText: function (prompt) {
                    var defer = $q.defer();

                    var modalScope = $rootScope.$new(true);
                    modalScope.$on('$destroy', function () {
                    });
                    open(modalScope, {
                        templateUrl: "/Areas/Management/app/spa/course_edit/information/ajax/popup-text.html",
                        controller: function($scope, $modalInstance) {
                            $scope.placeholder = prompt;
                            $scope.pop = {
                                text: null
                            };
                            $scope.close = $modalInstance.close;
                            $scope.save = function() {
                                defer.resolve($scope.pop.text);
                                $modalInstance.close();
                            };
                        }
                    })
                        .onClose(function() {
                            modalScope.$destroy();
                        });
                    return defer.promise;
                }
            };
        })
    ;

})();