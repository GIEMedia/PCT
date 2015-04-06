"use strict";

(function () {
    
    angular.module('pct.markup', [
        "ngSanitize"
    ])
        .directive("markup", ["$sanitize", function($sanitize) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    $scope.$watch(attrs.markup, function(markup) {
                        if (markup) {
                            elem.html($sanitize(
                                markup
                                    .replace(/&/g, "&amp;")
                                    .replace(/</g, "&lt;")
                                    .replace(/ /g, "&nbsp;")
                                    .replace(/>/g, "&lt;")
                                    .replace(new RegExp("\\[(\\/?[ibuIBU])\\]","g"), "<$1>")
                            ));
                        } else {
                            elem.html("");
                        }
                    });

                }
            };
        }])

    ;
})();