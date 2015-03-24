"use strict";

(function () {

    angular.module('pct.fancybox', [
    ])

        .factory("Fancybox", ["$q", "$compile", "$templateCache", "$http", "$controller", "$rootScope", function($q, $compile, $templateCache, $http, $controller, $rootScope) {
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
                    if (options.controller) {
                        $controller(options.controller, {'$scope': $scope, "$modalInstance": { close: close, dismiss: close }});
                    }
                    var contentEl = $compile(angular.element(content))($scope);

                    var fancybox = $.fancybox({
                        content: contentEl,
                        maxWidth: 750,
                        width: options.width? options.width : "auto",
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
                promptText: function (title, prompt) {
                    var defer = $q.defer();

                    var modalScope = $rootScope.$new(true);
                    modalScope.$on('$destroy', function () {
                    });
                    open(modalScope, {
                        templateUrl: "Areas/Management/app/spa/common/popup-text.html",
                        controller: function($scope, $modalInstance) {
                            $scope.title = title;
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
        }])
    ;
})();