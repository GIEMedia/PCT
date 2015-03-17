"use strict";

(function () {

    angular.module('pct.management.courseEdit.information.states', [
    ])
        .directive("stateAdder", function() {
            return {
                restrict: "A",
                templateUrl: "/Areas/Management/app/spa/course_edit/information/StateAdder.html",
                link: function($scope, elem, attrs) {
                }
            };
        })
        .directive("courseInformationStates", function() {
            return {
                restrict: "A",
                templateUrl: "/Areas/Management/app/spa/course_edit/information/CourseInformationStates.html",
                link: function($scope, elem, attrs) {
                }
            };
        })
    ;

})();