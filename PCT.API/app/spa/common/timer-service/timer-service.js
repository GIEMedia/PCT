"use strict";

(function () {

    angular.module("pct.common.timer-service", [
            "pct.common.idle-detector"
    ])
        .factory("timerService", ["idleDetector", "headerTimerService", "modal", "SecurityService", function(idleDetector, headerTimerService, modal, SecurityService) {
            return {
                start: function(stateName, timeConsumption) {

                    headerTimerService.startCountup(timeConsumption);

                    function startDetectingIdle() {

                        idleDetector.detect(idleDurationSecs, function() {
                            headerTimerService.pause();
                            modal.open({
                                templateUrl: "app/spa/common/timer-service/idle-warning-modal.html?v=" + htmlVer,
                                cssClass: "idle-warning-modal",
                                controller: "timer-service.idle-warning-modal.ctrl",
                                resolve: {
                                    stateName: function() { return stateName; }
                                }
                            }).result.then(
                                function() {
                                    SecurityService.logout();
                                    idleDetector.stop();
                                    headerTimerService.stopCountdown();
                                }, function() {
                                    headerTimerService.resume();
                                    startDetectingIdle();
                                }
                            );
                        });
                    }
                    startDetectingIdle();
                },
                stop: function() {
                    idleDetector.stop();
                    headerTimerService.stopCountdown();
                }
            };
        }])

        .controller("timer-service.idle-warning-modal.ctrl", ["$scope", "$modalInstance", "stateName", function($scope, $modalInstance, stateName, SecurityService) {
            $scope.continueCourse = $modalInstance.dismiss;
            $scope.logout = $modalInstance.close;
            $scope.stateName = $modalInstance.stateName;

            //idleDurationSecs
            var endTime = new Date().getTime() +  60 * 1000;

            $scope.$watch(function() { return new Date().getTime() > endTime; }, function(ended) {
                if (ended) {
                    setTimeout(function() {
                        $modalInstance.close();
                    }, 0);
                }
            });

            $scope.countDown = function() {
                var countDownTime = Math.floor((endTime - new Date().getTime()) / 1000);
                return countDownTime > 0 ? countDownTime : 0 ;
            };
        }])

        .directive("interval1Second", function() {
            return {
                restrict: "A",
                controller: ["$scope", "$interval", function ($scope, $interval) {
                    var interval = $interval(null, 1000);
                    $scope.$on('$destroy', function () {
                        $interval.cancel(interval);
                    });
                }]
            };
        })
    ;

})();