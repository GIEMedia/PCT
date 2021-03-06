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

                    $.fancybox({
                        content: contentEl,
                        maxWidth: 750,
                        width: options.width? options.width : "auto",
                        height: 'auto',
                        fitToView: false,
                        autoSize: false,
                        afterClose: invokeCloseListeners,
                        closeClick: false,
                        helpers: {
                            overlay: {
                                locked: false
                            }
                        }
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
                    modalScope.title = title;
                    modalScope.placeholder = prompt;
                    modalScope.action = function(text) {
                        defer.resolve(text);
                    };
                    open(modalScope, {
                        templateUrl: "Areas/Management/app/spa/common/popup-text.html?v=" + htmlVer,
                        controller: "pct.fancybox.PromptTextCtrl"
                    })
                        .onClose(function() {
                            modalScope.$destroy();
                        });
                    return defer.promise;
                },
                alert: function (title, text) {
                    var defer = $q.defer();

                    var modalScope = $rootScope.$new(true);
                    modalScope.title = title;
                    modalScope.text = text;
                    modalScope.action = defer.resolve;
                    open(modalScope, {
                        templateUrl: "Areas/Management/app/spa/common/popup-alert.html?v=" + htmlVer,
                        controller: "pct.fancybox.AlertCtrl",
                        width: 550
                    })
                        .onClose(function() {
                            modalScope.$destroy();
                        });
                    return defer.promise;
                },
                confirm: function (title, text, yes, no) {
                    var defer = $q.defer();

                    var modalScope = $rootScope.$new(true);
                    modalScope.title = title;
                    modalScope.text = text;
                    modalScope.yes = yes || "Yes";
                    modalScope.no = no || "Cancel";
                    modalScope.action = defer.resolve;
                    open(modalScope, {
                        templateUrl: "Areas/Management/app/spa/common/popup-confirm.html?v=" + htmlVer,
                        controller: "pct.fancybox.ConfirmCtrl",
                        width: 550
                    })
                        .onClose(function() {
                            modalScope.$destroy();
                        });
                    return defer.promise;
                },
                openFormTemplate: function (data, options) {
                    var defer = $q.defer();

                    var modalScope = $rootScope.$new(true);
                    if (data != null) modalScope.data = ObjectUtil.clone(data);
                    modalScope.action = defer.resolve;
                    open(modalScope, {
                        templateUrl: options.templateUrl,
                        controller: options.controller
                    })
                        .onClose(function() {
                            modalScope.$destroy();
                        });
                    return defer.promise;
                }
            };
        }])

        .controller("pct.fancybox.PromptTextCtrl", ["$scope", "$modalInstance", function($scope, $modalInstance) {
            $scope.pop = {
                text: null
            };
            $scope.close = $modalInstance.close;
            $scope.save = function() {
                $scope.action($scope.pop.text);
                $modalInstance.close();
            };
        }])

        .controller("pct.fancybox.ConfirmCtrl", ["$scope", "$modalInstance", function($scope, $modalInstance) {
            $scope.close = $modalInstance.close;
            $scope.save = function() {
                $scope.action();
                $modalInstance.close();
            };
        }])

        .controller("pct.fancybox.AlertCtrl", ["$scope", "$modalInstance", function($scope, $modalInstance) {
            $scope.close = function() {
                $scope.action();
                $modalInstance.close();
            };
        }])
    ;
})();