"use strict";

(function () {

    angular.module('pct.elearning.mock.data.Certificate', [
    ])

        .value("CertificateMockData", {
            single: {
                name: "PCT Pest Insecticide",
                image: "/app/css/images/certificate.jpg"
            },
            earnedCertificates: [
                {
                    name: "PCT Pest Insecticide 1",
                    passed_date: new Date("11/23/14")
                },
                {
                    name: "PCT Pest Insecticide 2",
                    passed_date: new Date("11/24/14")
                },
                {
                    name: "PCT Pest Insecticide 3",
                    passed_date: new Date("11/25/14")
                }
            ]
        })
    ;

})();
