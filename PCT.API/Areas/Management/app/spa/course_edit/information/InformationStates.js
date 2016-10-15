"use strict";

(function () {

    angular.module('pct.management.courseEdit.information.states', [
    ])
        .directive("stateAdder", function() {
            return {
                restrict: "A",
                templateUrl: "Areas/Management/app/spa/course_edit/information/StateAdder.html?v=" + htmlVer,
                link: function($scope, elem, attrs) {
                    $scope.stateAdder = {
                        model: {}
                    };

                    $scope.add = function() {
                        $scope.$eval(attrs.stateAdder, {"$state": $scope.stateAdder.model});
                        $scope.stateAdder.model = {};
                        $scope.addStateForm.$setPristine(true);
                    };

                    $scope.filteredCode = function (stateCode) {
                        return Cols.filter($scope.certificationCategories, function (categori) {
                            return categori.state == stateCode;
                        })
                    };

                    $scope.$watch("stateAdder.model.state", function(value) {
                        $scope.stateAdder.model.category_id = null;
                    });

                }
            };
        })
        .directive("courseInformationStates", ["StateService","CourseService", function(StateService, CourseService) {
            return {
                restrict: "A",
                templateUrl: "Areas/Management/app/spa/course_edit/information/InformationStates.html?v=" + htmlVer,
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
                        //$scope.filteredStates = Cols.filter($scope.states, function(s) {
                        //    return !ids[s.code];
                        //});
                        $scope.filteredStates = $scope.states;


                        //console.log($scope.filteredStates.length);
                    });

                    CourseService.getCertificationCategories().then(function (resp) {
                       $scope.certificationCategories = resp.data;
                    });




                    $scope.stateByCode = StateService.stateByCode;

                    $scope.addState = function(state) {
                        $scope.cei.course.state_ceus.push(state);
                    };

                    $scope.remove = function(stateCeu) {
                        Cols.remove(stateCeu, $scope.cei.course.state_ceus);
                    };
                }
            };
        }])


        .filter('filterCategoryCode', function () {
            return function (id, CategoriesCode) {
                if (!CategoriesCode) return null;
                var certification = Cols.find(CategoriesCode, function (c) {
                    return c.id == id;
                });

                return (certification.name ? certification.name : '') + ' ' + (certification.number ? certification.number : '');
            }
        })
    ;
})();