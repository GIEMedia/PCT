"use strict";

(function () {

    angular.module('pct.elearning.layout', [
        'pct.elearning.errorContainter',
        "pct.elearning.layout.page-header",
        "pct.elearning.layout.header-timer",
        "pct.elearning.layout.licensure-modal"
    ])

        .factory("LayoutService", function() {
            var _errorContainerElem;
            var timeForErrorToHide;
            return {
                registerErrorContainer: function(errorContainerElem) {
                    _errorContainerElem = errorContainerElem;
                },
                showError: function(duration) {
                    _errorContainerElem.show();
                    timeForErrorToHide = new Date().getTime() + duration;
                    setTimeout(function() {
                        if (new Date().getTime() < timeForErrorToHide) {
                            return;
                        }
                        _errorContainerElem.hide();
                    }, duration + 1);
                }
            };
        })
    ;

})();