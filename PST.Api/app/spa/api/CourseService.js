"use strict";

(function () {

    angular.module('pct.elearning.api.Course', [
    ])
        .factory("CourseService", function($timeout) {
            //var TestService = $resource("/api/test", {}, {
            //    submit: {method: 'POST'}
            //});

            var CourseService = {};

            CourseService.get = function(data, onDone) {
                //$timeout(onDone,0);
                return {
                    "name": "PCT Pest Insecticide",
                    "pages": [
                        "app/css/images/temp/pdf-placeholder.jpg"
                    ],
                    "sections": [
                        {
                            "name": "Trade Name/Ingredients/First Aid",
                            "questions": [
                                {
                                    "question": "Which of the following pests can be treated using PCT Pest Insecticide?",
                                    "type": "pictures",
                                    "answer": [],
                                    "explanation": "This product is labeled to treat carpenter ants, German cockroaches and silverfish, but it is NOT labeled for treating bed bugs.",
                                    "pictures": [
                                        "app/css/images/temp/img-answer1.jpg",
                                        "app/css/images/temp/img-answer2.jpg",
                                        "app/css/images/temp/img-answer3.jpg",
                                        "app/css/images/temp/img-answer4.jpg",
                                        "app/css/images/temp/img-answer5.jpg",
                                        "app/css/images/temp/img-answer6.jpg"
                                    ]
                                },
                                {
                                    "question": "This product can be used to treat for little black ants.",
                                    "type": "text",
                                    "answer": 0,
                                    "explanation": "When you read the list of target pests at the top of the label, it specifically lists four types of ants but little black ants is not one of them. On some labels, it will say \"Ants, including...\" and provide a number of common species, but this label is specific to only four types of ants.",
                                    "options": [
                                        "True",
                                        "False"
                                    ]
                                },
                                {
                                    "question": "Identify the bug pictured above.",
                                    "type": "picture",
                                    "picture": "app/css/images/temp/img-answer-large.jpg",
                                    "answer": 0,
                                    "explanation": "The image is of a carpenter ant.",
                                    "options": [
                                        "Carpenter ant",
                                        "German cockroach",
                                        "Bed bug",
                                        "None of the above"
                                    ]
                                },
                                {
                                    "question": "What is the active ingredient in PCT Pest Insecticide?",
                                    "type": "video",
                                    "video": {
                                        "mp4":"http://vjs.zencdn.net/v/oceans.mp4",
                                        "webm":"http://vjs.zencdn.net/v/oceans.webm"
                                    },
                                    "answer": 2,
                                    "explanation": "This product contains 0.1% of the active ingredient, Pestothrin.",
                                    "options": [
                                        "Cyfluthrin",
                                        "Pentamyacin",
                                        "Pestothrin",
                                        "None of the above"
                                    ]
                                }
                            ]
                        }
                    ]
                };
            };


            return CourseService;
        })
    ;

})();