"use strict";

(function () {

    angular.module('pct.elearning.api.Test', [
    ])
        .factory("TestService", function($timeout, Api) {

            var sampleTest = {
                title: "Mock Test title",
                passing_percentage: 0.8,
                questions: []
            };

            var progressSample = {
                max_retries: 3,
                retries_left : 3,
                corrects: [
                    {
                        answer: ["dj923-weg-ewrtcwe"],
                        correct_response_heading : "Correct!",
                        correct_response_text : "Yeah"
                    }
                ]
            };


            var testFirst = Async.ladyFirst();

            var _progress = {
                retries_left : 3,
                max_retries: 3
            };


            return {
                get : function(courseId) {
                    return Api.get("api/test/" + courseId).success(function(test) {

                        test.title = "Mock Test title";
                        test.passing_percentage = 0.8;

                        var corrects = {};
                        for (var i = 0; i < test.questions.length; i++) {
                            var question = test.questions[i];
                            if (Math.random() * 10 > 5) {
                            //if (question.answered) {
                                corrects[question.question_id] = {
                                    answer: [question.options[0].option_id],
                                    correct_response_heading : "Correct!",
                                    correct_response_text : "Yeah"
                                };
                            }
                        }
                        _progress.corrects = corrects;
                        testFirst.ladyDone();
                    });
                },
                getProgress: function(courseId) {

                    return {success: function(onSuccess) {
                        testFirst.manTurn(function() {
                            onSuccess(_progress);
                        });
                    }};
                },
                submit : function(answers, courseId, callback) {
                    var result = {};
                    Cols.eachEntry(answers, function(questionId, answer) {
                        if (Math.random() * 10 > 5) {
                            result[questionId] = {
                                answer: answers[questionId],
                                correct_response_heading: "Correct!",
                                correct_response_text: "Yeah"
                            };
                        }
                    });
                    callback(result);
                }
            };
        })

        //.factory("TestService", function($timeout, Api) {
        //
        //    return {
        //        get : function(courseId) {
        //            return Api.get("api/test/" + courseId);
        //        },
        //        submit : function(answers, courseId, callback) {
        //            var sending = [];
        //            Cols.eachEntry(answers, function(questionId, answer) {
        //                sending.push({
        //                    "question_id": questionId,
        //                    "selected_option_ids": answer
        //                });
        //            });
        //
        //            Api.put("api/test/answer/" + courseId, sending).success(function(answerResults) {
        //                var finalResult = {
        //                    corrects: {}
        //                };
        //
        //                for (var i = 0; i < answerResults.length; i++) {
        //                    var answerResult = answerResults[i];
        //                    if (answerResult.correct) {
        //                        finalResult.corrects[answerResult.question_id] = {
        //                            correct : true,
        //                            correct_response_heading : answerResult.correct_response_heading,
        //                            correct_response_text : answerResult.correct_response_text
        //                        };
        //                    }
        //                }
        //
        //                finalResult.passed = Cols.length(finalResult.corrects) / Cols.length(answers);
        //                callback(finalResult);
        //            });
        //
        //        }
        //    };
        //})
    ;

})();