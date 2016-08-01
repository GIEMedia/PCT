"use strict";

(function () {

    angular.module("pct.elearning.certification", [
        "pct.elearning.certification.print-service"
    ])

        .controller("certification.ctrl", ["$scope", "User", "course", function($scope, User, course) {
            $scope.User = User;
            $scope.course = course;

        }])

    ;

})();