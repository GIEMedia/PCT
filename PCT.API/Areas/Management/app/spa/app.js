"use strict";

(function () {
    /* App Module */
    angular.module("pct.management", [
        'pct.Security',

        'pct.markup',

        'pct.management.layout',
        'pct.management.theme',

        'pct.management.login',
        'pct.management.courses',
        'pct.management.courseEdit',
        'pct.management.report',
        'pct.management.settings',
        'pct.management.user',

        'pct.management.api.course',
        'pct.management.api.question',
        'pct.management.api.section',
        'pct.management.api.user',
        'pct.management.api.category',
        'pct.management.api.manufacturer',
        'pct.management.api.report',
        'pct.management.api.state'
    ])

        .config(["ApiProvider", "LayoutServiceProvider", "ReviewServiceProvider", function (ApiProvider, LayoutServiceProvider, ReviewServiceProvider) {
            ApiProvider.setHost(appHost); // set in _layout.cshtml

            LayoutServiceProvider.setProfileLink("//" + appHost + "/#/profile");

            ReviewServiceProvider.setReviewUrl(
                "//" + appHost + "/#/course/{courseId}/preview",
                "//" + appHost + "/#/test/{courseId}/preview"
            );
        }])

        .config(["SecurityProvider", function(SecurityProvider) {
            SecurityProvider.set({
                loginState : "login",
                defaultUserState : "courses",
                allowUnauthen : function(state) {
                    return state.name == "login";
                }
            });
        }])
        .run(["Security", "Api", "$q", "$http", function(Security, Api, $q, $http) {
            Security.setApi({
                login: function(data) {
                    var defer = $q.defer();

                    Api.postForm("api/account/login", data).onError(function() {return true;}).then(
                        function(resp) {
                            $http({
                                method: "GET",
                                url: (Api.getHost() ? "//" + Api.getHost() + "/" : "") + "api/account/verify",
                                headers: {'Authorization': "Bearer " + resp.data.access_token}
                            }).then(
                                function() {
                                    defer.resolve(resp);
                                },
                                function() {
                                    defer.reject("You don't have enough privilege");
                                }
                            );
                        },
                        function(resp) {
                            if (resp.status == 400) {
                                defer.reject('Incorrect Username or Password.');
                            } else {
                                defer.reject("Error: Unknown");
                            }
                        }
                    );
                    return defer.promise;
                }
            });
        }])

        /**
         * This config show Fancybox alerts whenver receiving API error 500
         */
        .run(["Api", "Fancybox", function(Api, Fancybox) {
            var showingError = false;
            Api.onError(function(data, status) {
                if (status == 500) {
                    // This is to avoid multiple errors to launch many alert boxes
                    if (!showingError) {
                        showingError = true;
                        Fancybox.alert("Internal server error", "An error occurred attempting to process your request. We apologize for the inconvenience. Please try again.").then(function() {
                            showingError = false;
                        });
                    }
                    return true;
                }
            });
        }])

        .run(["Api", "$upload", function(Api, $upload) {
            Api.upload = function(url, file) {
                return Api.handleError($upload.upload({
                    method: 'POST',
                    url: (Api.getHost() ? "//" + Api.getHost() + "/" : "") + url,
                    headers: {'Authorization': "Bearer " + sessionStorage.access_token},
                    file: file
                }));
            }
        }])
    ;
})();
