"use strict";

(function () {

    angular.module('pct.elearning.api.Certificate', [
        'pct.elearning.mock.data.Certificate'
    ])
        .factory("CertificateService", function(CertificateMockData) {
            return {
                getCertificate: function() {
                    return CertificateMockData.single;
                },
                getEarnedCertificates: function() {
                    return CertificateMockData.earnedCertificates;
                },
                getCertificateCategories: function() {
                    return CertificateMockData.certificateCategories;
                }
            };
        })
    ;

})();