"use strict";

(function () {

    angular.module("pct.common.window-size", [
    ])

        .factory("$ws", ["$rootScope", function ($rootScope) {
            var testDiv = $("<div class='test-ws'></div>");
            $("body").append(testDiv);

            var $ws = {};

            var watchSize = Watchers.watcher(function(newSize) {
                ObjectUtil.clear($ws);

                if (newSize == "xs") {
                    $ws.xs = true;
                } else if (newSize == "lg") {
                    $ws.lg = true;
                }

                $rootScope.$applyAsync();
            });

            var $window = $(window);

            var checkSize = function () {
                var size = testDiv.css("content");
                watchSize(size.replace(/"/g, ""));
            };

            $window.resize(checkSize);
            checkSize();
            return $ws;
        }])
    ;

})();