"use strict";

(function () {

	angular.module("pct.common.modal", [
        "pct.common.template-opener"
	])
		.factory("modal", ["$q", "TemplateOpener", function($q, TemplateOpener) {

            function appendModelElem(elem, cssClass, cssBodyClass) {
                var modal = $("<div class='modal'></div>");
                modal.append(elem);

                var modalOverlay = $("<div class='modal-overlay'></div>");
                modalOverlay.append(modal);
                if (cssClass) {
                    modalOverlay.addClass(cssClass);
                }

                var body = $("body");
                body.append(modalOverlay);

                if(cssBodyClass) {
                    body.addClass(cssBodyClass);
                }

                modal.click(function(evt) {
                    evt.stopPropagation();
                });

                return {
                    onClickOutside: function(func) {
                        modalOverlay.click(func);
                    },
                    remove: function() {
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
                        if(options.bodyClass) {
                            $("body").removeClass(options.bodyClass);
                        }
                        $modalInstanceDeferred.reject(reason);
                    };
                    var $modalInstance = {
                        dismiss: dismiss,
                        close: function (reason) {
                            if (destroy) {
                                destroy();
                            }

                            if(options.bodyClass) {
                                $("body").removeClass(options.bodyClass);
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
                        var modalWrapper = appendModelElem(view.elem, options.cssClass, options.bodyClass);

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
	;

})();