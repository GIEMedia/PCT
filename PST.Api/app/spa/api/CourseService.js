"use strict";

(function () {

    angular.module('pct.elearning.api.Course', [
    ])
        .factory("CourseService", function($timeout, CourseSampleData) {
            var equalSet = function (o1, o2) {
                if (o1 == null) {
                    return o2 == null;
                }

                if (o2 == null) {
                    return false;
                }

                if ((typeof o1) != (typeof o2)) {
                    return false;
                }

                if (o1.length != o2.length) {
                    return false;
                }

                o1.sort();
                o2.sort();

                for (var i = 0; i < o1.length; i++) {
                    var o1e = o1[i];
                    var o2e = o2[i];

                    if (o1e != o2e) {
                        return false;
                    }
                }

                return true;
            };

            var CourseService = {};

            CourseService.check = function(questionId, answer, callback) {
                if (questionId == "902c059c-adf9-47c6-957f-80b283dcd913" && equalSet(answer, ["902c059c-adf9-47c6-957f-80b283dcd913"])) {
                    callback(true, "This product is labeled to treat carpenter ants, German cockroaches and silverfish, but it is NOT labeled for treating bed bugs.");
                } else if (questionId == "16ef5514-059a-4490-a3ac-a43202bd2a21" && equalSet(answer, ["1380e8ac-d486-464c-8197-9a1b5fbcc9a3"])) {
                    callback(true, "When you read the list of target pests at the top of the label, it specifically lists four types of ants but little black ants is not one of them. On some labels, it will say \"Ants, including...\" and provide a number of common species, but this label is specific to only four types of ants.");
                } else if (questionId == "1380e8ac-d486-464c-8197-9a1b5fbcc9a3" && equalSet(answer, ["902c059c-adf9-47c6-957f-80b283dcd913"])) {
                    callback(true, "The image is of a carpenter ant.");
                } else if (questionId == "cba92dd2-47f0-4171-b0f5-2923dba347a3" && equalSet(answer, ["912eac82-b76d-4e49-8c6d-05a91e44f946"])) {
                    callback(true, "This product contains 0.1% of the active ingredient, Pestothrin.");
                } else {
                    callback(false);
                }
            };

            CourseService.get = function(id, onDone) {
                $timeout(onDone,0);
                return CourseSampleData.course1;
            };

            CourseService.getNewCourses = function() {
                return CourseSampleData.newCourses;
            };

            CourseService.getOpenCourses = function() {
                return CourseSampleData.openCourses;
            };
            CourseService.getCourseStructure = function() {
                return CourseSampleData.courseStructure;
            };


            return CourseService;
        })

        .value("CourseSampleData", {
            course1: {
                "name": "PCT Pest Insecticide",
                "sections": [
                    {
                        "name": "Trade Name/Ingredients/First Aid",
                        "document": {
                            "pdf_url" : "app/temp/sample.pdf",
                            "pages": [
                                "app/css/images/temp/pdf-placeholder.jpg",
                                "app/css/images/temp/pdf-placeholder2.jpg"
                            ]
                        },
                        "questions": [
                            {
                                "question_id": "902c059c-adf9-47c6-957f-80b283dcd913",
                                "question": "Which of the following pests can be treated using PCT Pest Insecticide?",
                                "answer_type": "pictures",
                                "multi_select": true,
                                "options": [
                                    {"option_id": "902c059c-adf9-47c6-957f-80b283dcd913", "picture": "app/css/images/temp/img-answer1.jpg"},
                                    {"option_id": "1380e8ac-d486-464c-8197-9a1b5fbcc9a3", "picture": "app/css/images/temp/img-answer2.jpg"},
                                    {"option_id": "f28a2b88-31de-4d45-9814-f2008a9fcc53", "picture": "app/css/images/temp/img-answer3.jpg"},
                                    {"option_id": "16ef5514-059a-4490-a3ac-a43202bd2a21", "picture": "app/css/images/temp/img-answer4.jpg"},
                                    {"option_id": "9a91e716-044f-472e-a357-60f07ff09f03", "picture": "app/css/images/temp/img-answer5.jpg"},
                                    {"option_id": "cba92dd2-47f0-4171-b0f5-2923dba347a3", "picture": "app/css/images/temp/img-answer6.jpg"}
                                ]
                            },
                            {
                                "question_id": "16ef5514-059a-4490-a3ac-a43202bd2a21",
                                "question": "This product can be used to treat for little black ants.",
                                "answer_type": "text",
                                "multi_select": false,
                                "options": [
                                    {"option_id": "902c059c-adf9-47c6-957f-80b283dcd913", "text": "True"},
                                    {"option_id": "1380e8ac-d486-464c-8197-9a1b5fbcc9a3", "text": "False"}
                                ]
                            },
                            {
                                "question_id": "1380e8ac-d486-464c-8197-9a1b5fbcc9a3",
                                "question": "Identify the bug pictured above.",
                                "answer_type": "text",
                                "picture": "app/css/images/temp/img-answer-large.jpg",
                                "multi_select": false,
                                "options": [
                                    {"option_id": "902c059c-adf9-47c6-957f-80b283dcd913", "text": "Carpenter ant"},
                                    {"option_id": "1380e8ac-d486-464c-8197-9a1b5fbcc9a3", "text": "German cockroach"},
                                    {"option_id": "cba92dd2-47f0-4171-b0f5-2923dba347a3", "text": "Bed bug"},
                                    {"option_id": "b1d61cbe-5105-4c3f-9210-9bd1c9e4ebbb", "text": "None of the above"}
                                ]
                            },
                            {
                                "question_id": "cba92dd2-47f0-4171-b0f5-2923dba347a3",
                                "question": "What is the active ingredient in PCT Pest Insecticide?",
                                "answer_type": "text",
                                "video": {
                                    "mp4": "http://www.pctonline.com/FileUploads/media/PCT_Online_Training/PCT_Pest_Insecticide_WO.mp4"
                                },
                                "multi_select": false,
                                "options": [
                                    {"option_id": "5b3c44f1-48fd-4b59-84a5-bf6a16d111b8", "text": "Cyfluthrin"},
                                    {"option_id": "91e83fa1-2c93-407c-9f41-2fb0b7b2da4f", "text": "Pentamyacin"},
                                    {"option_id": "912eac82-b76d-4e49-8c6d-05a91e44f946", "text": "Pestothrin"},
                                    {"option_id": "cba92dd2-47f0-4171-b0f5-2923dba347a3", "text": "None of the above"}
                                ]
                            }
                        ]
                    },
                    {
                        "name": "Trade Name/Ingredients/First Aid 2",
                        "document": {
                            "pdf_url" : "app/temp/sample.pdf",
                            "pages": [
                                "app/css/images/temp/pdf-placeholder.jpg",
                                "app/css/images/temp/pdf-placeholder2.jpg"
                            ]
                        },
                        "questions": [
                            {
                                "question_id": "16ef5514-059a-4490-a3ac-a43202bd2a21",
                                "question": "This product can be used to treat for little black ants.",
                                "answer_type": "text",
                                "multi_select": false,
                                "options": [
                                    {"option_id": "902c059c-adf9-47c6-957f-80b283dcd913", "text": "True"},
                                    {"option_id": "1380e8ac-d486-464c-8197-9a1b5fbcc9a3", "text": "False"}
                                ]
                            }
                        ]
                    },
                    {
                        "name": "Trade Name/Ingredients/First Aid 3",
                        "document": {
                            "pdf_url" : "app/temp/sample.pdf",
                            "pages": [
                                "app/css/images/temp/pdf-placeholder.jpg",
                                "app/css/images/temp/pdf-placeholder2.jpg"
                            ]
                        },
                        "questions": [
                            {
                                "question_id": "cba92dd2-47f0-4171-b0f5-2923dba347a3",
                                "question": "What is the active ingredient in PCT Pest Insecticide?",
                                "answer_type": "text",
                                "video": {
                                    "mp4": "http://www.pctonline.com/FileUploads/media/PCT_Online_Training/PCT_Pest_Insecticide_WO.mp4"
                                },
                                "multi_select": false,
                                "options": [
                                    {"option_id": "5b3c44f1-48fd-4b59-84a5-bf6a16d111b8", "text": "Cyfluthrin"},
                                    {"option_id": "91e83fa1-2c93-407c-9f41-2fb0b7b2da4f", "text": "Pentamyacin"},
                                    {"option_id": "912eac82-b76d-4e49-8c6d-05a91e44f946", "text": "Pestothrin"},
                                    {"option_id": "cba92dd2-47f0-4171-b0f5-2923dba347a3", "text": "None of the above"}
                                ]
                            }
                        ]
                    }
                ]
            },
            newCourses: [
                {
                    "id": 0,
                    "name": "PCT Label Training Course 1",
                    "description": "CEUS Available: AL, AR, IL, OH, FL"
                },
                {
                    "id": 0,
                    "name": "PCT Label Training Course 2",
                    "description": "CEUS Available: AR, IL, OH, FL"
                },
                {
                    "id": 0,
                    "name": "PCT Label Training Course 3",
                    "description": "CEUS Available: AL, IL, OH, FL"
                },
                {
                    "id": 0,
                    "name": "PCT Label Training Course 4",
                    "description": "CEUS Available: AL, AR, OH, FL"
                }
            ],
            openCourses: [
                {
                    "id": 1,
                    "name": "PCT Pest Insecticide 1",
                    "progress": 0,
                    "test": 0
                },
                {
                    "id": 2,
                    "name": "PCT Pest Insecticide 2",
                    "progress": 4/15,
                    "test": 0
                },
                {
                    "id": 3,
                    "name": "PCT Pest Insecticide 3",
                    "progress": 1,
                    "test": 3/10
                }
            ],
            courseStructure: [
                {
                    "name": "Course Header 1",
                    "categories": [
                        {
                            "name": "Subterranean and Other",
                            "courses": [
                                {"id": 0, "name": "Course Name 1"},
                                {"id": 0, "name": "Course Name 2"}
                            ]
                        }
                    ]
                },
                {
                    "name": "Course Header 2",
                    "categories": [
                        {
                            "name": "Natural And Cruelty",
                            "courses": [
                                {"id": 0, "name": "Course Name 3"},
                                {"id": 0, "name": "Course Name 4"}
                            ]
                        },
                        {
                            "name": "Killing Rats",
                            "courses": [
                                {"id": 0, "name": "Course Name 5"},
                                {"id": 0, "name": "Course Name 6"}
                            ]
                        }
                    ]
                }
            ]


        })
    ;

})();