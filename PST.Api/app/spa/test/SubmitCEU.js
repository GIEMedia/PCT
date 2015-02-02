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
                    $scope.pristine = true;
                    $scope.stateLicenses = [
                        {}
                    ];

                    $scope.states = StateService.getStates();
                    $scope.categories = [
                        {code: "cat1", name:"Category 1"},
                        {code: "cat2", name:"Category 2"},
                        {code: "cat3", name:"Category 3"}
                    ];

                    $scope.addStateLicense = function() {
                        $scope.stateLicenses.push({});
                    };
                    $scope.removeStateLicense = function(index) {
                        $scope.stateLicenses.splice(index, 1);
                    };

                    var validate = function() {
                        for (var i = 0; i < $scope.stateLicenses.length; i++) {
                            var license = $scope.stateLicenses[i];
                            if (
                                StringUtil.isBlank(license.state)
                                || StringUtil.isBlank(license.category)
                                || StringUtil.isBlank(license.num)
                                || StringUtil.isBlank(license.confirmNum)
                                || (license.num != license.confirmNum)
                            ) {
                                return false;
                            }
                        }
                        return true;
                    };
                    $scope.send = function() {
                        $scope.pristine = false;

                        if (validate()) {
                            $state.go("certificate");
                        }

                        return false;
                    };
                }
            };
        })
    ;

})();