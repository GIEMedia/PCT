"use strict";

(function () {

    angular.module('pct.Security', [
    ])

        .provider("Security", function() {
            var options = null;

            this.set = function(o) {
                options = o;
            };

            this.$get = function() {
                var apiOptions;
                return {
                    loginState: function() {
                        return options.loginState;
                    },
                    defaultUserState: function() {
                        return options.defaultUserState;
                    },
                    loginApi: function(data) {
                        return apiOptions.login(data);
                    },
                    allowUnauthen: function(state) {
                        return options.allowUnauthen(state);
                    },
                    setApi: function(_apiOptions) {
                        apiOptions = _apiOptions;
                    }
                };
            };
        })

        .factory("User", function() {
            return {
                loggedIn: false,
                fullName: null
            };
        })

        .run(["Api", "$state", "Security", function(Api, $state, Security) {
            Api.onError(function(data, status) {
                if (status == 401) {
                    if (sessionStorage.access_token != null) {
                        delete sessionStorage.access_token;
                    }
                    if ($state.current.name != Security.loginState()) {
                        $state.go(Security.loginState());
                    }
                    return true;
                }
            });
        }])

        .run(["Security", "$rootScope", "$state", function(Security, $rootScope, $state) {
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                if (sessionStorage.access_token == null) {
                    if (Security.allowUnauthen(toState)) {
                        ;
                    } else {
                        event.preventDefault();
                        Security.desiredState = {
                            state: toState,
                            params: toParams
                        };
                        $state.go(Security.loginState());
                    }
                }
            });
        }])

        .provider("Api", function() {
            var _host = null;

            this.setHost = function(host) {
                _host = host;
            };

            this.$get = ["$http", function($http) {
                var defaultErrorHandlers = [];

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

                        for (var i = 0; i < defaultErrorHandlers.length; i++) {
                            var eh = defaultErrorHandlers[i];
                            if (eh(data, status, headers, config)) {
                                return;
                            }
                        }

                        //alert("Unhandled api error:\nUrl: " + config.url + "\nResponse status: " + status + "\n" + JSON.stringify(data));
                        //console.log("Unhandled api error:\n    Url: " + config.url + "\n    Response status: " + status);
                        //console.log(data);

                        console.log("An error occured");
                    });

                    return httpPromise;
                };

                var sendHttp = function(method, url, data) {
                    return handleError($http({
                        method: method,
                        url: (_host ? "http://" + _host + "/" : "") + url,
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
                    postForm: function(url, data) {
                        return handleError($http({
                            method: 'POST',
                            url: (_host? "http://" + _host + "/" : "") + url,
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
                    onError: function(handler) {
                        defaultErrorHandlers.push(handler);
                    },
                    getHost: function() {
                        return _host;
                    },
                    handleError: handleError
                };
            }];
        })

        .factory("SecurityService", ["Security", "Api", "User", "$state", function(Security, Api, User, $state) {
            var fetchUser = function() {
                return Api.get("api/account")
                    .success(function(account) {
                        User.loggedIn = true;
                        User.firstName = account.first_name;
                        User.fullName = account.first_name + " " + account.last_name;
                    })
                    .onError(function(error, status) {
                        if (status == 401) {
                            sessionStorage.access_token = null;
                            $state.go(Security.loginState());
                            return true;
                        } else {
                            return false;
                        }
                    });
            };

            if (sessionStorage.access_token != null && sessionStorage.access_token != "null") {
                fetchUser().success(function() {
                    if ($state.current.name == Security.loginState()) {
                        $state.go(Security.defaultUserState());
                    }
                });
            }

            return {
                login: function(username, password, remember, firstLogin) {
                    var data = {
                        grant_type: "password",
                        username: username,
                        password: password
                    };

                    if (remember) {
                        localStorage.remembered_login = username;
                    } else {
                        localStorage.removeItem("remembered_login");
                    }

                    return Security.loginApi(data).then(function(resp) {
                        sessionStorage.access_token = resp.data.access_token;
                        fetchUser();

                        if (Security.desiredState == null) {
                            $state.go(Security.defaultUserState(), {firstLogin: firstLogin});
                        } else {
                            $state.go(Security.desiredState.state, Security.desiredState.params);
                            Security.desiredState = null;
                        }
                    });
                },
                logout: function() {
                    Api.delete("api/account/logout");
                    sessionStorage.access_token = null;
                    User.loggedIn = false;
                    User.firstName = null;
                    User.fullName = null;
                    $state.go(Security.loginState());
                }
            };
        }])
    ;
})();