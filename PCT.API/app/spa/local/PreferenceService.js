"use strict";

(function () {

    angular.module('pct.elearning.local.Preference', [
    ])
        .factory("PreferenceService", function() {
            return {
                isCourseHelpEnabled: function() {
                    var enabled = localStorage.getItem("course.help.enabled");
                    return enabled == null || enabled == "true";
                },
                setCourseHelpEnabled: function(enabled) {
                    return localStorage.setItem("course.help.enabled", enabled);
                },
                isTestHelpEnabled: function() {
                    var enabled = localStorage.getItem("test.help.enabled");
                    return enabled == null || enabled == "true";
                },
                setTestHelpEnabled: function(enabled) {
                    return localStorage.setItem("test.help.enabled", enabled);
                }
            };
        })
    ;

})();