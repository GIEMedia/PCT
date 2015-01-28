"use strict";

(function () {

    angular.module('pct.elearning.api.Test', [
    ])
        .factory("TestService", function($resource) {
            return $resource("/api/test", {}, {
                submit: {method:'POST'}
            });
        })
    ;

})();