"use strict";

(function () {

    angular.module('pct.management.layout', [
    ])
        .directive("contentSideNav", function() {
            return {
                restrict: "E",
                templateUrl: "/Areas/Management/app/spa/layout/ContentSideNav.html",
                link: function($scope, elem, attrs) {
                }
            };
        })
    ;

})();