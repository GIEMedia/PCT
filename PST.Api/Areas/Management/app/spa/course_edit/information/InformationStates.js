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
                        $scope.$eval(attrs.stateAdder, {"$state": $scope.stateAdder.model});
                        $scope.stateAdder.model = {};
                    };
                }
            };
        })
        .directive("courseInformationStates", function(StateService) {
            return {
                restrict: "A",
                templateUrl: "/Areas/Management/app/spa/course_edit/information/InformationStates.html",
                link: function($scope, elem, attrs) {

                    $scope.states = StateService.getStates();

                    $scope.$watch("states == null ? -1 : cei.course.state_ceus.length", function(v) {
                        //console.log(v);
                        if (v == -1) {return;}

                        var ids = {};
                        if ($scope.cei.course) {
                            //console.log($scope.cei.course.state_ceus);
                            Cols.each($scope.cei.course.state_ceus, function(s) {
                                ids[s.state] = true;
                            });
                        }

                        //console.log($scope.states);
                        //console.log(ids);
                        $scope.filteredStates = Cols.filter($scope.states, function(s) {
                            return !ids[s.code];
                        });
                        //console.log($scope.filteredStates.length);
                    });

                    $scope.stateByCode = function(code) {
                        return Cols.find($scope.states, function (e) {
                            return e.code == code;
                        });
                    };

                    $scope.addState = function(state) {
                        $scope.cei.course.state_ceus.push(state);
                    };

                    $scope.remove = function(stateCeu) {
                        Cols.remove(stateCeu, $scope.cei.course.state_ceus);
                    };
                }
            };
        })
    ;

})();