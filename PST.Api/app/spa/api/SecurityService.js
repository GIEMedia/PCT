"use strict";

(function () {

    angular.module('pct.elearning.api.Security', [
    ])

        .factory("Api", ["$http", function($http) {

            var handleError = function(httpPromise) {

                var _handler = null;

                httpPromise.onError = function(handler) {
                    _handler = handler;
                };

                httpPromise.error(function(data, status, headers, config) {
                    if (_handler != null) {
                        var handleResult = _handler(data, status, headers, config);
                        if (handleResult) {
                            return;
                        }
                    }
                    alert("Unhandled api error:\nUrl: " + config.url + "\nResponse: " + status + "\n" + JSON.stringify(data));
                });

                return httpPromise;
            };

            var sendHttp = function(method, url, data) {
                return handleError($http({
                    method: method,
                    url: url,
                    headers: {'Authorization': "Bearer " + sessionStorage.access_token},
                    data: data
                }));
            };
            return {
                get: function(url) {
                    return sendHttp("GET", url);
                },
                post: function(url, data) {
                    return sendHttp("POST", url, data);
                },
                put: function(url, data) {
                    return sendHttp("PUT", url, data);
                },
                delete: function(url) {
                    return sendHttp("DELETE", url);
                },
                handleError: handleError
            };
        }])

        .factory("SecurityService", ["$http", "$rootScope", "$timeout", "Api", "User", "$state", function($http, $rootScope, $timeout, Api, User, $state) {
            var fetchUser = function() {
                Api.get("api/account")
                    .success(function(account) {
                        User.loggedIn = true;
                        User.firstName = account.first_name;
                        User.lastName = account.last_name;
                    })
                    .error(function() {
                        sessionStorage.access_token = null;
                        $state.go("landing");
                    });
            };

            if (sessionStorage.access_token != null && sessionStorage.access_token != "null") {
                fetchUser();
            } else {
                $timeout(function() {
                    $state.go("landing");
                }, 0);
            }

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                if (fromState.name == "landing" && sessionStorage.access_token == null) {
                    event.preventDefault();
                }
            });

            return {
                login: function(data) {
                    return Api.handleError($http({
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
                    );
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
        }])
    ;

})();