"use strict";

(function () {

    angular.module('pct.elearning.api.Test', [
        'pct.elearning.mock.data.CourseTest'
    ])
        .factory("TestService", function($timeout, CourseTestMockData) {
            //var TestService = $resource("/api/test", {}, {
            //    submit: {method: 'POST'}
            //});

            var TestService = {};

            TestService.query = function(data, onDone) {
                $timeout(onDone,0);
                return CourseTestMockData;
            };

            TestService.submit = function(data, callback) {
                if (data.round == 1) {
                    return {
                        passed: false,
                        corrects: [
                            {
                                question: 0,
                                explanation: "The signal word is Caution, not Warning."
                            },
                            {
                                question: 2,
                                explanation: "The label is important for the doctor or poison control center to have. If available, also providing the product's material safety data sheet (MSDS) is helpful."
                            }
                        ]
                    };
                } else if (data.round == 2) {
                    return {
                        passed: false,
                        corrects: [
                            {
                                question: 0,
                                explanation: "The signal word is Caution, not Warning."
                            },
                            {
                                question: 1,
                                explanation: "The signal word is Caution, not Warning."
                            },
                            {
                                question: 2,
                                explanation: "The label is important for the doctor or poison control center to have. If available, also providing the product's material safety data sheet (MSDS) is helpful."
                            }
                        ]
                    };
                } else if (data.round == 3) {
                    return {
                        passed: true
                    };
                }

                setTimeout(callback, 0);
            };

            return TestService;
        })
    ;

})();