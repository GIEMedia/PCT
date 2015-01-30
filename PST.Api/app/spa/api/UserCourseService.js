"use strict";

(function () {

    angular.module('pct.elearning.api.UserCourse', [
    ])
        .factory("UserCourseService", function($timeout) {
            //var TestService = $resource("/api/test", {}, {
            //    submit: {method: 'POST'}
            //});

            var UserCourseService = {};

            UserCourseService.getProgress = function(data, onDone) {
                //$timeout(onDone,0);
                return {
                    "sections": [4,1,0]
                };
            };
            return UserCourseService;
        })
    ;

})();