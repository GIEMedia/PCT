"use strict";;

(function () {

    angular.module("pct.elearning.layout.header-timer", [
    ])
        .directive("headerTimer", ["headerTimerService", "dateFilter", "CourseService", "$stateParams", function(headerTimerService, dateFilter, CourseService, $stateParams) {
            return {
                restrict: "E",
                scope: {},
                link: function($scope, elem) {

                    function formatTime(secs) {
                        try {
                            var remain = secs;
                            var hours = Math.floor(remain / (60 * 60));
                            remain = secs % (60 * 60);
                            var minutes = Math.floor(remain / (60));

                            if (hours === 0) return minutes + (minutes > 1 ? " mins" : " min");

                            var val = DateUtil.format2digits(hours) + ":" + DateUtil.format2digits(minutes);
                            if (val === "NaN:NaN") val = "";
                            return val;
                        } catch (e) {
                            return "";
                        }
                    }

                    var intervalRequest;

                    $scope.$watch(function() { return headerTimerService.getTimerEnd() != null; }, function(hasTimer) {
                        if (hasTimer) {
                            elem.show();

                            var timeConsumption = new Date().getTime() - headerTimerService.getTimerEnd();
                            elem.text(formatTime(timeConsumption / 1000));

                            intervalRequest = setInterval(function () {
                                CourseService.incrementCourseActivity($stateParams.id || $stateParams.courseId, 10).then(function (resp) {
                                    elem.text(formatTime(resp.data));
                                });
                            }, 10 * 1000); // every 10 seconds

                        } else {
                            elem.hide();
                            clearInterval(intervalRequest);
                        }
                    });
                    $scope.$watch(function() { return headerTimerService.isPaused(); }, function(isPaused) {
                        if (isPaused) {
                            elem.addClass("paused");
                        } else {
                            elem.removeClass("paused");
                        }
                    });
                }
            };
        }])

        .factory("headerTimerService", function() {
            var timerEnd;
            var paused;
            return {
                startCountup: function(timeConsumption) {
                    timerEnd = new Date().getTime() - timeConsumption * 1000;
                },
                getTimerEnd: function() {
                    return paused ? new Date().getTime() + paused : timerEnd;
                },
                stopCountdown: function() {
                    timerEnd = null;
                    paused = null;
                },
                pause: function() {
                    paused = timerEnd - new Date().getTime();
                    timerEnd = null;
                },
                resume: function() {
                    timerEnd = new Date().getTime() + paused;
                    paused = null;
                },
                isPaused: function() {
                    return paused != null;
                }
            };
        })
    ;

})();