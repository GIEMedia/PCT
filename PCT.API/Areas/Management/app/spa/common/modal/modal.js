"use strict";

(function () {

	angular.module("pct.management.modal", [
        "pct.management.template-opener"
	])
		.factory("modal", ["$q", "TemplateOpener", function($q, TemplateOpener) {
            function appendModelElem(elem, $modalInstance, options) {
                var modal = $("<div class='modal'></div>");
                if (options.width) {
                    modal.width(options.width);
                }

                var $closeBtn = $("<a class='close'></a>");
                modal.append($closeBtn);
                modal.append(elem);

                var modalClass = options.modalClass;

                if (modalClass) {
                    modal.addClass(modalClass);
                }

                var modalOverlay = $("<div class='modal-overlay'></div>");
                modalOverlay.append(modal);

                $("body").append(modalOverlay);
                // $("body").append(modalOverlay).addClass("modal-open");

                modal.click(function(evt) {
                    evt.stopPropagation();
                });

                $closeBtn.click(function() {
                    $modalInstance.dismiss();
                });

                return {
                    onClickOutside: function(func) {
                        modalOverlay.on("mousedown", function (e) {
                            if (e.target == e.currentTarget) {
                                func();
                            }
                        });
                    },
                    remove: function() {
                        $("body").removeClass("modal-open");
                        modalOverlay.remove();
                    }
                };
            }

            return {
                open: function(options) {
                    var destroy;
                    var $modalInstanceDeferred = $q.defer();
                    var dismiss = function(reason) {
                        if (destroy) {
                            destroy();
                        }
                        $modalInstanceDeferred.reject(reason);
                    };
                    var $modalInstance = {
                        dismiss: dismiss,
                        close: function (reason) {
                            if (destroy) {
                                destroy();
                            }
                            $modalInstanceDeferred.resolve(reason);
                        },
                        result: $modalInstanceDeferred.promise
                    };

                    options.resolve = options.resolve || {};
                    options.resolve.$modalInstance = function() {
                        return $modalInstance
                    };

                    TemplateOpener.openTemplate(options).then(function(view) {
                        var modalWrapper = appendModelElem(view.elem, $modalInstance, options);

                        destroy = function() {
                            view.scope.$destroy();
                        };
                        if (!options.modal) {
                            modalWrapper.onClickOutside(dismiss);
                        }

                        view.scope.$on("$destroy", function() {
                            modalWrapper.remove();
                        });
                    });

                    return $modalInstance;
                }
            };
		}])
        
        // TODO: modal alert promt

        .factory("modalConfirm", ["$rootScope", "modal", function($rootScope, modal) {
            return {
                open: function (title, text, yes, no) {

                    var modalScope = $rootScope.$new(true);
                    modalScope.title = title;
                    modalScope.text = text;
                    modalScope.yes = yes || "Yes";
                    modalScope.no = no || "Cancel";

                    return modal.open({
                        templateUrl: "Areas/Management/app/spa/common/modal/modal-confirm.html?v=" + htmlVer,
                        controller: "pct.modal-confirm.ctrl",
                        width: 550,
                        scope: modalScope
                    });
                }
            };
        }])

        .controller("pct.modal-confirm.ctrl", ["$scope", "$modalInstance", function($scope, $modalInstance) {
            $scope.close = $modalInstance.dismiss;
            $scope.save = function() {
                $modalInstance.close();
            };
        }])

        .factory("modalAlert", ["$rootScope", "modal", function($rootScope, modal) {
            return {
                open: function (title, text) {

                    var modalScope = $rootScope.$new(true);
                    modalScope.title = title;
                    modalScope.text = text;

                    return modal.open({
                        templateUrl: "Areas/Management/app/spa/common/modal/modal-alert.html?v=" + htmlVer,
                        controller: "pct.modal-confirm.ctrl",
                        width: 550,
                        scope: modalScope
                    });
                }
            };
        }])

        .controller("pct.modal-alert.ctrl", ["$scope", "$modalInstance", function($scope, $modalInstance) {
            $scope.close = $modalInstance.close;
        }])

        .factory("modalPrompt", ["$rootScope", "modal", function($rootScope, modal) {
            return {
                open: function (title, prompt) {

                    var modalScope = $rootScope.$new(true);
                    modalScope.title = title;
                    modalScope.placeholder = prompt;

                    return modal.open({
                        templateUrl: "Areas/Management/app/spa/common/modal/modal-prompt-text.html?v=" + htmlVer,
                        controller: "pct.modal-prompt.ctrl",
                        width: 350,
                        scope: modalScope
                    });
                }
            };
        }])

        .controller("pct.modal-prompt.ctrl", ["$scope", "$modalInstance", function($scope, $modalInstance) {
            $scope.close = $modalInstance.dismiss;
            $scope.save = function() {
                $modalInstance.close($scope.pop.text);
            };
        }])
	;

})();