"use strict";

(function () {

    angular.module('pct.elearning.api.Security', [
    ])

        .factory("Api", function($http) {
            var sendHttp = function(method, url, data) {
                return $http({
                    method: method,
                    url: url,
                    headers: {'Authorization': "Bearer " + sessionStorage.access_token},
                    data: data
                });
            };
            return {
                get: function(url) {
                    return sendHttp("GET", url);
                },
                post: function(url, data) {
                    return sendHttp("POST", url, data);
                },
                delete: function(url) {
                    return sendHttp("DELETE", url);
                }
            };
        })

        .factory("SecurityService", function($http, Api, User, $state) {
            var fetchUser = function() {
                Api.get("api/account")
                    .success(function(account) {
                        User.loggedIn = true;
                        User.firstName = account.first_name;
                        User.lastName = account.last_name;
                    })
                    .error(function() {
                        sessionStorage.access_token = null;
                    });
            };

            if (sessionStorage.access_token != null && sessionStorage.access_token != "null") {
                fetchUser();
            }
            return {
                login: function(data) {
                    return $http({
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
                        .success(function(resp) {
                            sessionStorage.access_token = resp.access_token;
                            fetchUser();
                        })


                    ;
                },
                logout: function() {
                    Api.delete("api/account/logout").then(function() {
                        sessionStorage.access_token = null;
                        User.loggedIn = false;
                        User.firstName = null;
                        User.fullName = null;
                        $state.go("landing");
                    });
                }
            };
        })
    ;

})();