"use strict";

(function () {

    angular.module('pct.elearning.api.Test', [
    ])

        .factory("TestService", ["$timeout", "Api", function($timeout, Api) {

            return {
                get : function(courseId) {
                    return Api.get("api/test/" + courseId);
                },
                getProgress: function(courseId, callback) {
                    return Api.get("api/account/progress/test/" + courseId).success(function(resp) {
                        var rawCaq = resp.correctly_answered_questions;
                        var corrects = {};
                        for (var i = 0; i < rawCaq.length; i++) {
                            var caq = rawCaq[i];
                            corrects[caq.question_id] = {
                                answer: caq.correct_options,
                                correct_response_heading : caq.correct_response_heading,
                                correct_response_text : caq.correct_response_text
                            };
                        }
                        callback({
                            max_retries: resp.max_retries,
                            retries_left : resp.retries_left,
                            corrects: corrects
                        });
                    });
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
                        };

                        for (var i = 0; i < answerResults.length; i++) {
                            var answerResult = answerResults[i];
                            if (answerResult.correct) {
                                finalResult[answerResult.question_id] = {
                                    answer : answers[answerResult.question_id],
                                    correct_response_heading : answerResult.correct_response_heading,
                                    correct_response_text : answerResult.correct_response_text
                                };
                            }
                        }

                        callback(finalResult);
                    });

                }
            };
        }])
    ;

})();