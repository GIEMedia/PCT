"use strict";

(function () {

    angular.module('pct.elearning.api.Security', [
    ])

        .factory("Api", ["$http", function($http) {

            var handleError = function(httpPromise) {

                var _handler = null;

                httpPromise.onError = function(handler) {
                    _handler = handler;
                    return httpPromise;
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

            var _host = null;
            var sendHttp = function(method, url, data) {
                return handleError($http({
                    method: method,
                    url: (_host==null? "" : "http://" + _host + "/") + url,
                    headers: {'Authorization': "Bearer " + sessionStorage.access_token},
                    data: data
                }));
            };
            return {
                setHost: function(host) {
                    _host = host;
                },
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
                postForm: function(url, data) {
                    return handleError($http({
                        method: 'POST',
                        url: (_host==null? "" : "http://" + _host + "/") + url,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: data
                    }));
                },
                handleError: handleError
            };
        }])

        .factory("SecurityService", ["$http", "$rootScope", "$timeout", "Api", "User", "$state", function($http, $rootScope, $timeout, Api, User, $state) {
            var fetchUser = function() {
                return Api.get("api/account")
                    .success(function(account) {
                        User.loggedIn = true;
                        User.firstName = account.first_name;
                        User.lastName = account.last_name;
                    })
                    .onError(function(error, status) {
                        if (status == 401) {
                            sessionStorage.access_token = null;
                            $state.go("landing");
                            return true;
                        } else {
                            return false;
                        }
                    });
            };

            if (sessionStorage.access_token != null && sessionStorage.access_token != "null") {
                fetchUser().success(function() {
                    if ($state.current.name == "landing") {
                        $state.go("dashboard");
                    }
                });
            }

            var desiredState = null;
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                if (sessionStorage.access_token == null) {
                    if (fromState.name == "landing") {
                        event.preventDefault();
                    } else {
                        if (toState.name == "landing") {
                            ;
                        } else {
                            event.preventDefault();
                            desiredState = {
                                state: toState,
                                params: toParams
                            };
                            $state.go("landing");
                        }
                    }
                }
            });

            return {
                login: function(data) {
                    return Api.postForm("api/account/login", data)
                            .success(function(resp) {
                                sessionStorage.access_token = resp.access_token;
                                fetchUser();

                                if (desiredState == null) {
                                    $state.go("dashboard");
                                } else {
                                    $state.go(desiredState.state, desiredState.params);
                                    desiredState = null;
                                }
                            });
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