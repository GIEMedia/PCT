"use strict";

(function () {

    angular.module('pct.elearning.mock.api.State', [
        'pct.elearning.mock.data.State'
    ])
        .factory("StateService", function(StateMockData) {
            return {
                getStates: function() {
                    return StateMockData;
                }
            };
        })
    ;

})();