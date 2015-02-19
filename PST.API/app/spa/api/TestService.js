"use strict";

(function () {

    angular.module('pct.elearning.api.Test', [
    ])
        .factory("TestService", function($timeout, Api, $q) {

            return {
                get : function(courseId) {
                    return Api.get("api/test/" + courseId);
                },
                submit : function(answers, courseId, callback) {
                    var finalResult = {
                        corrects: {}
                    };
                    var waits = [];
                    Cols.eachEntry(answers, function(questionId, answer) {
                        waits.push(Api.put("api/test/answer/" + courseId + "/" + questionId, answer).success(function(result) {
                            if (result.correct) {
                                finalResult.corrects[questionId] = result;
                            }
                        }));
                    });

                    $q.all(waits).then(function() {
                        finalResult.passed = Cols.length(finalResult.corrects) / Cols.length(answers);
                        callback(finalResult);
                    });
                }
            };
        })
    ;

})();