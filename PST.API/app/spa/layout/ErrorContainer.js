"use strict";

(function () {

    angular.module('pct.elearning.errorContainter', [
    ])
        .directive("errorContainer", ["LayoutService", function(LayoutService) {
            return {
                restrict: "E",
                replace: true,
                template: '<div class="error-container" style="display: none"><div><i class="fa fa-exclamation-triangle"></i> &nbsp; An error occurred attempting to process your request. We apologize for the inconvenience. Please try again.</div></div>',
                link: function($scope, elem, attrs) {
                    LayoutService.registerErrorContainer(elem);
                }
            };
        }])
    ;

})();