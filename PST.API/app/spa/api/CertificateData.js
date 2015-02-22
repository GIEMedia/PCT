"use strict";

(function () {

    angular.module('pct.elearning.data.Certificate', [
    ])

        .value("CertificateMockData", {
            single: {
                name: "PCT Pest Insecticide",
                image: "/app/css/images/certificate.jpg"
            },
            earnedCertificates: [
                {
                    course_name: "PCT Pest Insecticide 1",
                    earned: new Date("11/23/14")
                },
                {
                    course_name: "PCT Pest Insecticide 2",
                    earned: new Date("11/24/14")
                },
                {
                    course_name: "PCT Pest Insecticide 3",
                    earned: new Date("11/25/14")
                }
            ],
            certificateCategories: [
                {code: "cat1", name:"Category 1"},
                {code: "cat2", name:"Category 2"},
                {code: "cat3", name:"Category 3"}
            ]
        })
    ;

})();
