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
    ;
})();
