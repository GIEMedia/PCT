"use strict";

(function () {

    angular.module('pct.management.api.state', [
    ])
        .factory("StateService", ["StateData", function(StateData) {
            return {
                getStates: function() {
                    return StateData;
                },
                stateByCode: function(code) {
                    return Cols.find(StateData, function (e) {
                        return e.code == code;
                    });
                }
            };
        }])


        .value("StateData", [
            {
                "code": "AL",
                "name": "Alabama"
            },
            {
                "code": "AK",
                "name": "Alaska"
            },
            {
                "code": "AZ",
                "name": "Arizona"
            },
            {
                "code": "AR",
                "name": "Arkansas"
            },
            {
                "code": "CA",
                "name": "California"
            },
            {
                "code": "CO",
                "name": "Colorado"
            },
            {
                "code": "CT",
                "name": "Connecticut"
            },
            {
                "code": "DE",
                "name": "Delaware"
            },
            {
                "code": "FL",
                "name": "Florida"
            },
            {
                "code": "GA",
                "name": "Georgia"
            },
            {
                "code": "HI",
                "name": "Hawaii"
            },
            {
                "code": "ID",
                "name": "Idaho"
            },
            {
                "code": "IL",
                "name": "Illinois"
            },
            {
                "code": "IN",
                "name": "Indiana"
            },
            {
                "code": "IA",
                "name": "Iowa"
            },
            {
                "code": "KS",
                "name": "Kansas"
            },
            {
                "code": "KY",
                "name": "Kentucky"
            },
            {
                "code": "LA",
                "name": "Louisiana"
            },
            {
                "code": "ME",
                "name": "Maine"
            },
            {
                "code": "MD",
                "name": "Maryland"
            },
            {
                "code": "MA",
                "name": "Massachusetts"
            },
            {
                "code": "MI",
                "name": "Michigan"
            },
            {
                "code": "MN",
                "name": "Minnesota"
            },
            {
                "code": "MS",
                "name": "Mississippi"
            },
            {
                "code": "MO",
                "name": "Missouri"
            },
            {
                "code": "MT",
                "name": "Montana"
            },
            {
                "code": "NE",
                "name": "Nebraska"
            },
            {
                "code": "NV",
                "name": "Nevada"
            },
            {
                "code": "NH",
                "name": "New Hampshire"
            },
            {
                "code": "NJ",
                "name": "New Jersey"
            },
            {
                "code": "NM",
                "name": "New Mexico"
            },
            {
                "code": "NY",
                "name": "New York"
            },
            {
                "code": "NC",
                "name": "North Carolina"
            },
            {
                "code": "ND",
                "name": "North Dakota"
            },
            {
                "code": "OH",
                "name": "Ohio"
            },
            {
                "code": "OK",
                "name": "Oklahoma"
            },
            {
                "code": "OR",
                "name": "Oregon"
            },
            {
                "code": "PA",
                "name": "Pennsylvania"
            },
            {
                "code": "PR",
                "name": "Puerto Rico"
            },
            {
                "code": "RI",
                "name": "Rhode Island"
            },
            {
                "code": "SC",
                "name": "South Carolina"
            },
            {
                "code": "SD",
                "name": "South Dakota"
            },
            {
                "code": "TN",
                "name": "Tennessee"
            },
            {
                "code": "TX",
                "name": "Texas"
            },
            {
                "code": "UT",
                "name": "Utah"
            },
            {
                "code": "VT",
                "name": "Vermont"
            },
            {
                "code": "VA",
                "name": "Virginia"
            },
            {
                "code": "WA",
                "name": "Washington"
            },
            {
                "code": "DC",
                "name": "Washington D.C."
            },
            {
                "code": "WV",
                "name": "West Virginia"
            },
            {
                "code": "WI",
                "name": "Wisconsin"
            },
            {
                "code": "WY",
                "name": "Wyoming"
            },
            {
                "code": "AB",
                "name": "Alberta"
            },
            {
                "code": "BC",
                "name": "British Columbia"
            },
            {
                "code": "MB",
                "name": "Manitoba"
            },
            {
                "code": "NB",
                "name": "New Brunswick"
            },
            {
                "code": "NL",
                "name": "Newfoundland and Labrador"
            },
            {
                "code": "NS",
                "name": "Nova Scotia"
            },
            {
                "code": "NU",
                "name": "Nunavut"
            },
            {
                "code": "NT",
                "name": "Northwest Territories"
            },
            {
                "code": "ON",
                "name": "Ontario"
            },
            {
                "code": "PE",
                "name": "Prince Edward Island"
            },
            {
                "code": "QC",
                "name": "Quebec"
            },
            {
                "code": "SK",
                "name": "Saskatchewan"
            },
            {
                "code": "YT",
                "name": "Yukon"
            }
        ])
    ;

})();