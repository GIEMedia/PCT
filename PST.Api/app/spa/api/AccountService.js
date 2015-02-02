"use strict";

(function () {

    angular.module('pct.elearning.api.Account', [
    ])
        .factory("AccountService", function($http) {
            return {
                createAccount: function(data) {
                    return $http.post("api/account/register", data);
                },
                getAccount: function(name) {

                    $http({
                        method: 'GET',
                        url: "api/account/" + name,
                        headers: {'auth': "zMhIMnJtJzM_Mdjpz2ZzruQNl-6uI2CXCJm9F4ooqqPFfbz-fnofxD7llqfocQUWg8zqSXzdkkXGFb96t81e1SUxjYJYNlwOAH1AXDvUGA5k_eA6uv2gaZUJ5m8plOW1OpKPZlrspRUNn4F_h1UqqMnQ95ikja688s7D8BCZIKX_uC8NZS2vy_xwOix2Du0-scBmBCrWNfG30PonDNGZAuWhGN850mGEjtD1lbWiDdVFhatX4OHFxed5_LTaLGd5Noa4UIcZOdij41CmeWBPD25P4V-xegViJAbIfRU6jXjeqyha4Mxg7ZsAqIcPRViG2U642H4BRlfP__tHnwtrG7ILF7U5oc0pqrVaFA9b27LspkaG3pu_YVKn0bEsCTDoaUB7hHWyvS_zQnXUGDREOoCF_M2v-oBTRub93oMaEPCWVAAt-PfgBgBbA1gn9TEL"},
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: null
                    })
                        //.success(callback)
                        //.error(function() {
                        //    callback(null);
                        //})
                    ;

                    //$http.get("api/account/" + name);
                }
            };
        })
    ;

})();