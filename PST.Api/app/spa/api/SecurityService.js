"use strict";

(function () {

    angular.module('pct.elearning.api.Security', [
    ])

        //.factory("SecurityService", function() {
        //    return {
        //        login: function(data, callback) {
        //            callback({
        //                "access_token":"boQtj0SCGz2GFGzf1ew6weg5",
        //                "token_type":"bearer",
        //                "expires_in":1209599,
        //                "userName":"David Hurt",
        //                ".issued":"Mon, 14 Oct 2013 06:53:32 GMT",
        //                ".expires":"Mon, 28 Oct 2013 06:53:32 GMT"
        //            });
        //        },
        //        logout: function() {
        //
        //        }
        //    };
        //})
        .factory("SecurityService", function($http) {
            return {
                login: function(data, callback) {
                    $http({
                        method: 'POST',
                        url: "/api/account/login",
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: data
                    })
                        .success(callback)
                        .error(function() {
                            callback(null);
                        })
                    ;

                }
            };
        })
    ;

})();