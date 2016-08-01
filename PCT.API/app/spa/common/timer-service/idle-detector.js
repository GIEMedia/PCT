"use strict";

(function () {

    angular.module("pct.common.idle-detector", [

    ])
        .factory("idleDetector", function() {
            var lastActivityTime;
            var cleanup;
            var $body = $("body");
            return {
                detect: function(durationSeconds, onIdle) {
                    var setLastActivity = function() {
                        lastActivityTime = new Date().getTime();
                    };
                    setLastActivity();
                    $body.mousemove(setLastActivity);
                    $body.mousedown(setLastActivity);

                    var interval = setInterval(function() {
                        if (lastActivityTime != null && new Date().getTime() - lastActivityTime > durationSeconds * 1000) {
                            cleanup();
                            cleanup = null;
                            onIdle();
                        }
                    }, 1000);

                    cleanup = function() {
                        clearInterval(interval);
                    };
                },
                stop: function() {
                    if (cleanup) {
                        cleanup();
                        cleanup = null;
                    }
                }
            };
        })
    ;

})();