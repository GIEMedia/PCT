"use strict";

(function () {

    angular.module('pct.elearning.api.Profile', [
        'pct.elearning.mock.data.Profile'
    ])
        .factory("ProfileService", function(ProfileMockData) {
            return {
                getUserInfo: function() {
                    return ProfileMockData.userInfo;
                },
                getCompanyInfo: function() {
                    return ProfileMockData.companyInfo;
                }
            };
        })
    ;

})();