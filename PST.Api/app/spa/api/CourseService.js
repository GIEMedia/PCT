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
                            "name": "",
                            "questions": [
                                {
                                    "question": "Which of the following pests can be treated using PCT Pest Insecticide?",
                                    "type": "pictures",
                                    "pictures": [
                                        "app/css/images/temp/img-answer1.jpg",
                                        "app/css/images/temp/img-answer2.jpg",
                                        "app/css/images/temp/img-answer3.jpg",
                                        "app/css/images/temp/img-answer4.jpg",
                                        "app/css/images/temp/img-answer5.jpg",
                                        "app/css/images/temp/img-answer6.jpg"
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