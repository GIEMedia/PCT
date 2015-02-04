"use strict";

(function () {

    angular.module('pct.elearning.api.UserCourse', [
    ])
        .factory("UserCourseService", function($timeout) {
            //var TestService = $resource("/api/test", {}, {
            //    submit: {method: 'POST'}
            //});

            var UserCourseService = {};

            UserCourseService.getProgress = function(courseId, onDone) {
                //$timeout(onDone,0);

                if (courseId == "0") {
                    return {"sections": [0,0,0]};
                } else if (courseId == "1") {
                    return {"sections": [0,0,0]};
                } else if (courseId == "2") {
                    return {"sections": [4,1,0]};
                } else if (courseId == "3") {
                    return {"sections": [4,1,1]};
                }
            };
            return UserCourseService;
        })
    ;

})();