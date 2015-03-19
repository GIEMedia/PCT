"use strict";

(function () {

    angular.module('pct.management.courseEdit.reviewInvite', [
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.reviewInvite', {
                    url: '/reviewInvite',
                    templateUrl: "/Areas/Management/app/spa/course_edit/review_invite/ReviewInvite.html",
                    controller: "courseEdit.reviewInvite.Ctrl"
                })
            ;
        })

        .controller("courseEdit.reviewInvite.Ctrl", function ($scope, StateService) {
            $scope.setCel({
                step: 3
            });

            $scope.states = StateService.getStates();
        })
    ;

})();