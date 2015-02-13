"use strict";

(function () {

    angular.module('pct.elearning.api.UserCourse', [
    ])
        .factory("UserCourseService", function($timeout) {
            //var TestService = $resource("/api/test", {}, {
            //    submit: {method: 'POST'}
            //});

            var UserCourseService = {};

            var getProgress = function(courseId, onDone) {
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

            UserCourseService.updateProgress = function(id, course) {

                var p = getProgress(id);

                for (var i = 0; i < course.sections.length; i++) {
                    var section = course.sections[i];

                    var progress = p.sections[i];
                    if (progress >= section.questions.length) {
                        section.complete = true;
                    } else {
                        section.complete = false;

                        for (var j = 0; j < section.questions.length; j++) {
                            var question = section.questions[j];
                            question.answered = j < progress;
                        }
                    }
                }
                return course;
            };
            return UserCourseService;
        })
    ;

})();