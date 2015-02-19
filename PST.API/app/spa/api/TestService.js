"use strict";

(function () {

    angular.module('pct.elearning.api.Test', [
    ])
        .factory("TestService", function($timeout, Api, $q) {
            //var TestService = $resource("/api/test", {}, {
            //    submit: {method: 'POST'}
            //});

            var TestService = {};

            TestService.get = function(courseId) {
                return Api.get("api/test/" + courseId);
            };

            TestService.submit = function(answers, courseId, callback) {
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
                    finalResult.passed = Cols.length(answers) == Cols.length(finalResult.corrects);
                    callback(finalResult);
                });

                //if (data.round == 1) {
                //    return {
                //        passed: false,
                //        //passed: true,
                //
                //        corrects: [
                //            {
                //                question: 0,
                //                explanation: "The signal word is Caution, not Warning."
                //            },
                //            {
                //                question: 2,
                //                explanation: "The label is important for the doctor or poison control center to have. If available, also providing the product's material safety data sheet (MSDS) is helpful."
                //            }
                //        ]
                //    };
                //} else if (data.round == 2) {
                //    return {
                //        passed: false,
                //        corrects: [
                //            {
                //                question: 0,
                //                explanation: "The signal word is Caution, not Warning."
                //            },
                //            {
                //                question: 1,
                //                explanation: "The signal word is Caution, not Warning."
                //            },
                //            {
                //                question: 2,
                //                explanation: "The label is important for the doctor or poison control center to have. If available, also providing the product's material safety data sheet (MSDS) is helpful."
                //            }
                //        ]
                //    };
                //} else if (data.round == 3) {
                //    return {
                //        passed: true
                //    };
                //}
                //
                //setTimeout(callback, 0);
            };

            return TestService;
        })
    ;

})();