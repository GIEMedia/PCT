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
                return [
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
                    },
                    {
                        "text": "Which of the following is TRUE regarding First Aid should someone accidentally swallow this product?",
                        "options" : [
                            {
                                "text": "Have the person drink some water."
                            },
                            {
                                "text": "Do not induce vomiting."
                            },
                            {
                                "text": "Do not induce vomiting unless instructed to do so by a doctor or poison control center."
                            },
                            {
                                "text": "Induce vomiting."
                            }
                        ]
                    },
                    {
                        "text": "In the event of an accident with this product, it is important to have the product label ready to provide to the doctor.",
                        "options" : [
                            {
                                "text": "True"
                            },
                            {
                                "text": "False"
                            }
                        ]
                    },
                    {
                        "text": "This product has an antidote.",
                        "options" : [
                            {
                                "text": "True"
                            },
                            {
                                "text": "False"
                            }
                        ]
                    }
                ];
            };

            TestService.submit = function(data, callback) {
                if (data.round == 1) {
                    return {
                        corrects: [
                            {},
                            {}
                        ]
                    };
                }
            };

            return TestService;
        })
    ;

})();