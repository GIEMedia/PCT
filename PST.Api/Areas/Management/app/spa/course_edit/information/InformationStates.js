"use strict";

(function () {

    angular.module('pct.management.courseEdit.information.states', [
    ])
        .directive("stateAdder", function($rootScope) {
            return {
                restrict: "A",
                templateUrl: "/Areas/Management/app/spa/course_edit/information/StateAdder.html",
                link: function($scope, elem, attrs) {
                    $scope.stateAdder = {
                        model: {}
                    };

                    $scope.add = function() {
                        $scope.$eval(attrs.stateAdder, {"$value": $scope.stateAdder.model});
                    };
                }
            };
        })
        .directive("courseInformationStates", function() {
            return {
                restrict: "A",
                templateUrl: "/Areas/Management/app/spa/course_edit/information/CourseInformationStates.html",
                link: function($scope, elem, attrs) {
                    $scope.remove = function(stateCeu) {
                        Cols.remove(stateCeu, $scope.cei.course.state_ceus);
                    };
                }
            };
        })
    ;

})();