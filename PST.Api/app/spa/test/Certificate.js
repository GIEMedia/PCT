"use strict";

(function () {

    angular.module('pct.elearning.certificate', [
            'ui.router'
    ])
    
        .config(function ($stateProvider) {

            $stateProvider
                .state('certificate', {
                    url: '/certificate',
                    templateUrl: "/app/spa/test/Certificate.html",
                    controller: "certificate.Ctrl"
                })
            ;
        })

        .controller("certificate.Ctrl", function ($scope, $state) {
            $scope.pristine = true;
            $scope.certificate = {
                name: "PCT Pest Insecticide",
                picture: "/app/css/images/certificate.jpg"
            };

            $scope.addresses = [
                {}
            ];

            $scope.validateEmail = function (email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            };
            var validate = function() {
                for (var i = 0; i < $scope.addresses.length; i++) {
                    var address = $scope.addresses[i];
                    if (
                        StringUtil.isBlank(address.name)
                        || StringUtil.isBlank(address.email)
                        || !$scope.validateEmail(address.email)
                    ) {
                        return false;
                    }
                }
                return true;
            };
            $scope.send = function() {
                $scope.pristine = false;

                if (validate()) {
                    $state.go("dashboard");
                }

                return false;
            };

            $scope.download = function() {
                window.open($scope.certificate.picture, "_blank");
                return false;
            };
        })

    ;

})();