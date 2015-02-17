"use strict";

(function () {

    angular.module('pct.elearning.mock.data.Course', [
    ])

        .value("CourseMockData", {
            course1: {
                "title": "PCT Pest Insecticide",
                "sections": [
                    {
                        "title": "Trade Name/Ingredients/First Aid",
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
                                "question_text": "Which of the following pests can be treated using PCT Pest Insecticide?",
                                "option_type": "image",
                                "multi_select": true,
                                "options": [
                                    {"option_id": "902c059c-adf9-47c6-957f-80b283dcd913", "image": "app/css/images/temp/img-answer1.jpg"},
                                    {"option_id": "1380e8ac-d486-464c-8197-9a1b5fbcc9a3", "image": "app/css/images/temp/img-answer2.jpg"},
                                    {"option_id": "f28a2b88-31de-4d45-9814-f2008a9fcc53", "image": "app/css/images/temp/img-answer3.jpg"},
                                    {"option_id": "16ef5514-059a-4490-a3ac-a43202bd2a21", "image": "app/css/images/temp/img-answer4.jpg"},
                                    {"option_id": "9a91e716-044f-472e-a357-60f07ff09f03", "image": "app/css/images/temp/img-answer5.jpg"},
                                    {"option_id": "cba92dd2-47f0-4171-b0f5-2923dba347a3", "image": "app/css/images/temp/img-answer6.jpg"}
                                ]
                            },
                            {
                                "question_id": "16ef5514-059a-4490-a3ac-a43202bd2a21",
                                "question_text": "This product can be used to treat for little black ants.",
                                "option_type": "text",
                                "multi_select": false,
                                "options": [
                                    {"option_id": "902c059c-adf9-47c6-957f-80b283dcd913", "text": "True"},
                                    {"option_id": "1380e8ac-d486-464c-8197-9a1b5fbcc9a3", "text": "False"}
                                ]
                            },
                            {
                                "question_id": "1380e8ac-d486-464c-8197-9a1b5fbcc9a3",
                                "question_text": "Identify the bug pictured above.",
                                "option_type": "text",
                                "image": "app/css/images/temp/img-answer-large.jpg",
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
                                "question_text": "What is the active ingredient in PCT Pest Insecticide?",
                                "option_type": "text",
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
                        "title": "Trade Name/Ingredients/First Aid 2",
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
                                "question_text": "This product can be used to treat for little black ants.",
                                "option_type": "text",
                                "multi_select": false,
                                "options": [
                                    {"option_id": "902c059c-adf9-47c6-957f-80b283dcd913", "text": "True"},
                                    {"option_id": "1380e8ac-d486-464c-8197-9a1b5fbcc9a3", "text": "False"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Trade Name/Ingredients/First Aid 3",
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
                                "question_text": "What is the active ingredient in PCT Pest Insecticide?",
                                "option_type": "text",
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
                    "course_id": 0,
                    "title": "PCT Label Training Course 1",
                    "description": "CEUS Available: AL, AR, IL, OH, FL"
                },
                {
                    "course_id": 0,
                    "title": "PCT Label Training Course 2",
                    "description": "CEUS Available: AR, IL, OH, FL"
                },
                {
                    "course_id": 0,
                    "title": "PCT Label Training Course 3",
                    "description": "CEUS Available: AL, IL, OH, FL"
                },
                {
                    "course_id": 0,
                    "title": "PCT Label Training Course 4",
                    "description": "CEUS Available: AL, AR, OH, FL"
                }
            ],
            openCourses: [
                {
                    "course_id": 1,
                    "title": "PCT Pest Insecticide 1",
                    "course_progress": 0,
                    "test_progress": 0,
                    "last_activity" : 1423066319046
                },
                {
                    "course_id": 2,
                    "title": "PCT Pest Insecticide 2",
                    "course_progress": 4/15,
                    "test_progress": 0,
                    "last_activity" : 1422817919046
                },
                {
                    "course_id": 3,
                    "title": "PCT Pest Insecticide 3",
                    "course_progress": 1,
                    "test_progress": 3/10,
                    "last_activity" : 1417893119046
                }
            ],
            courseStructure: [
                {
                    "title": "Course Header 1",
                    "categories": [
                        {
                            "title": "Subterranean and Other",
                            "courses": [
                                {"course_id": 0, "title": "Course Name 1"},
                                {"course_id": 0, "title": "Course Name 2"}
                            ]
                        }
                    ]
                },
                {
                    "title": "Course Header 2",
                    "categories": [
                        {
                            "title": "Natural And Cruelty",
                            "courses": [
                                {"course_id": 0, "title": "Course Name 3"},
                                {"course_id": 0, "title": "Course Name 4"}
                            ]
                        },
                        {
                            "title": "Killing Rats",
                            "courses": [
                                {"course_id": 0, "title": "Course Name 5"},
                                {"course_id": 0, "title": "Course Name 6"}
                            ]
                        }
                    ]
                }
            ]


        })
    ;

})();