"use strict";

(function () {
    /* App Module */
    angular.module("pct.management", [
        'pct.Security',

        'pct.management.layout',
        'pct.management.theme',

        'pct.management.login',
        'pct.management.courses',
        'pct.management.courseEdit',
        'pct.management.report',
        'pct.management.user',

        'pct.management.api.course',
        'pct.management.api.question',
        'pct.management.api.section',
        'pct.management.api.user',
        'pct.management.api.category',
        'pct.management.api.report',
        'pct.management.api.state'
    ])

        .run(["Api", "ReviewService", function (Api, ReviewService) {
            Api.setHost(appHost); // set in _layout.cshtml

            ReviewService.setReviewUrl(
                "//" + appHost + "/#/course/{courseId}/preview",
                "//" + appHost + "/#/test/{courseId}/preview"
            );
        }])
    ;
})();
