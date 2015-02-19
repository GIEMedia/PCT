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
                    var sending = [];
                    Cols.eachEntry(answers, function(questionId, answer) {
                        sending.push({
                            "question_id": questionId,
                            "selected_option_ids": answer
                        });
                    });

                    Api.put("api/test/answer/" + courseId, sending).success(function(answerResults) {
                        var finalResult = {
                            corrects: {}
                        };

                        for (var i = 0; i < answerResults.length; i++) {
                            var answerResult = answerResults[i];
                            if (answerResult.correct) {
                                finalResult.corrects[answerResult.question_id] = {
                                    correct : true,
                                    correct_response_heading : answerResult.correct_response_heading,
                                    correct_response_text : answerResult.correct_response_text
                                };
                            }
                        }

                        finalResult.passed = Cols.length(finalResult.corrects) / Cols.length(answers);
                        callback(finalResult);
                    });

                }
            };
        })
    ;

})();