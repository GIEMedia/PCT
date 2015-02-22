"use strict";

(function () {

    angular.module('pct.elearning.api.Certificate', [
        'pct.elearning.data.Certificate'
    ])
        .factory("CertificateService", function(Api, CertificateMockData) {
            return {
                getCertificate: function(courseId) {
                    return Api.get("api/account/certificate/" + courseId);
                },
                getEarnedCertificates: function() {
                    return Api.get("api/account/certificates");
                },
                getCertificateCategories: function() {
                    return CertificateMockData.certificateCategories;
                }
            };
        })
    ;

})();