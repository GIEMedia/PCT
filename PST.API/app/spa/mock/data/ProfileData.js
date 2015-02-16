"use strict";

(function () {

    angular.module('pct.elearning.mock.data.Profile', [
    ])

        .value("ProfileMockData", {
            userInfo: {
                first_name: "Dave",
                last_name: "Hurt",
                email: "dave@prototype1.com"
            },
            companyInfo: {
                company_name: "Prototype1",
                company_address: {
                    address1: "P.O. Box 329, 4193 Dolor Street",
                    address2: "Ap #468-2826 Purus Avenue",
                    city: "San Francisco",
                    state: "LA",
                    zip_code: "12345"
                }
            }
        })
    ;

})();
