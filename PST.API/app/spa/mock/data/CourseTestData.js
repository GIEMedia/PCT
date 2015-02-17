"use strict";

(function () {

    angular.module('pct.elearning.mock.data.CourseTest', [
    ])

        .value("CourseTestMockData", {
            test_name: "PCT Pest Insecticide",
            questions: [
                {
                    "question_id": "00d0e902-0d52-4af7-b11d-ce6f8c16d245",
                    "question_text": "The signal word is Caution, not Warning.",
                    "options" : [
                        {
                            "option_id": "42f9efb4-da63-472f-b1df-fab7ece0a963",
                            "text": "True"
                        },
                        {
                            "option_id": "f32aac41-750b-410a-9a86-8681f31068f5",
                            "text": "False"
                        }
                    ]
                },
                {
                    "question_id": "b6e7a3d6-efae-46a9-8ab7-21c9bfe58993",
                    "question_text": "Which of the following is TRUE regarding First Aid should someone accidentally swallow this product?",
                    "options" : [
                        {
                            "option_id": "ccefe712-60ab-40b8-bbef-65dcae93d122",
                            "text": "Have the person drink some water."
                        },
                        {
                            "option_id": "e26e641d-31ca-4c4e-8e45-19e184cf8f22",
                            "text": "Do not induce vomiting."
                        },
                        {
                            "option_id": "3c317776-00f9-470c-b0ae-684371ace451",
                            "text": "Do not induce vomiting unless instructed to do so by a doctor or poison control center."
                        },
                        {
                            "option_id": "40e7c98e-4ac4-4692-8b35-13b584c792ea",
                            "text": "Induce vomiting."
                        }
                    ]
                },
                {
                    "question_id": "e2b4ed07-1675-4971-8a5d-b4a06be13816",
                    "question_text": "In the event of an accident with this product, it is important to have the product label ready to provide to the doctor.",
                    "options" : [
                        {
                            "option_id": "a1ee35a3-2f3c-45ce-a9b3-2589b1ff6cea",
                            "text": "True"
                        },
                        {
                            "option_id": "5b40c79c-34ed-4ea4-837a-665606f3634a",
                            "text": "False"
                        }
                    ]
                },
                {
                    "question_id": "781cc37b-ab5d-471d-b535-67c3a350c6a2",
                    "question_text": "This product has an antidote.",
                    "options" : [
                        {
                            "option_id": "473db826-5f93-46e7-8c28-c6cc39632833",
                            "text": "True"
                        },
                        {
                            "option_id": "6ca18b67-cef1-45f2-b2a9-63de9cb33dad",
                            "text": "False"
                        }
                    ]
                }
            ]
        })
    ;

})();