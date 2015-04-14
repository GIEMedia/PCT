"use strict";

(function () {

    angular.module('pct.management.settings.manufacturer', [
    ])
        .directive("settingsManufaturers", function() {
            return {
                restrict: "E",
                replace: true,
                templateUrl: "Areas/Management/app/spa/settings/Manufaturers.html",
                link: function($scope, elem, attrs) {
                    
                }
            };
        })
    ;

})();