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
        .directive("courseInformationStates", function(StateService) {
            return {
                restrict: "A",
                templateUrl: "/Areas/Management/app/spa/course_edit/information/CourseInformationStates.html",
                link: function($scope, elem, attrs) {

                    $scope.states = StateService.getStates();

                    $scope.stateByCode = function(code) {
                        return Cols.find($scope.states, function (e) {
                            return e.code == code;
                        });
                    };

                    $scope.remove = function(stateCeu) {
                        Cols.remove(stateCeu, $scope.cei.course.state_ceus);
                    };
                }
            };
        })
    ;

})();