"use strict";

(function () {

    angular.module('pct.elearning.api.Test', [
    ])
        .factory("TestService", function($timeout) {
            //var TestService = $resource("/api/test", {}, {
            //    submit: {method: 'POST'}
            //});

            var TestService = {};

            TestService.query = function(data, onDone) {
                $timeout(onDone,0);
                return {
                    test_name: "PCT Pest Insecticide",
                    questions: [
                        {
                            "text": "The signal word is Caution, not Warning.",
                            "options" : [
                                {
                                    "text": "True"
                                },
                                {
                                    "text": "False"
                                }
                            ]
                            //},
                            //{
                            //    "text": "Which of the following is TRUE regarding First Aid should someone accidentally swallow this product?",
                            //    "options" : [
                            //        {
                            //            "text": "Have the person drink some water."
                            //        },
                            //        {
                            //            "text": "Do not induce vomiting."
                            //        },
                            //        {
                            //            "text": "Do not induce vomiting unless instructed to do so by a doctor or poison control center."
                            //        },
                            //        {
                            //            "text": "Induce vomiting."
                            //        }
                            //    ]
                            //},
                            //{
                            //    "text": "In the event of an accident with this product, it is important to have the product label ready to provide to the doctor.",
                            //    "options" : [
                            //        {
                            //            "text": "True"
                            //        },
                            //        {
                            //            "text": "False"
                            //        }
                            //    ]
                            //},
                            //{
                            //    "text": "This product has an antidote.",
                            //    "options" : [
                            //        {
                            //            "text": "True"
                            //        },
                            //        {
                            //            "text": "False"
                            //        }
                            //    ]
                        }
                    ]
                };
            };

            TestService.submit = function(data, callback) {
                if (data.round == 1) {
                    return {
                        passed: true,
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