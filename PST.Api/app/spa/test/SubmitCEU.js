"use strict";

(function () {

    angular.module('pct.elearning.test.submit_ceu', [
    ])
        .directive("submitCeu", function(StateService, $state) {
            return {
                restrict: "E",
                scope: true,
                templateUrl: "/app/spa/test/SubmitCEU.html",
                link: function($scope, elem, attrs) {
                    $scope.stateLicenses = [
                        {}
                    ];

                    $scope.states = StateService.getStates();
                    $scope.categories = [
                        {code: "cat1", name:"Category 1"},
                        {code: "cat2", name:"Category 2"},
                        {code: "cat3", name:"Category 3"}
                    ];

                    $scope.send = function() {
                        $state.go("certificate");

                        return false;
                    };
                }
            };
        })
    ;

})();