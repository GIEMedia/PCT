"use strict";

(function () {

    angular.module('pct.elearning.local.Preference', [
    ])
        .factory("PreferenceService", function() {
            return {
                isHelpEnabled: function() {
                    var enabled = localStorage.getItem("help.enabled");
                    return enabled == null || enabled == "true";
                },
                setHelpEnabled: function(enabled) {
                    return localStorage.setItem("help.enabled", enabled);
                }
            };
        })
    ;

})();