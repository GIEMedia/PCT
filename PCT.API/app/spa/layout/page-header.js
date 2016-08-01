"use strict";

(function () {

    angular.module("pct.elearning.layout.page-header", [
    ])
        .directive("pageHeader", function() {
            return {
                restrict: "E",
                scope: {},
                templateUrl: "app/spa/layout/page-header.html?v=" + htmlVer,
                controller: ["$scope", "SecurityService", "User", "$state", "$ws", "gieLocalStorage", function($scope, SecurityService, User, $state,
                                                                                            $ws, gieLocalStorage) {

                    $scope.$ws = $ws;
                    $scope.User = User;
                    $scope.$state = $state;


                    $scope.showLicensurePopup = function() {
                        if (!User.loggedIn) {
                            return false;
                        }
                        var disabledLicensurePopup = gieLocalStorage.forUser(User.ID).get("disabledLicensurePopup");
                        return !disabledLicensurePopup;
                    };

                    $scope.logout = function() {
                        SecurityService.logout();
                    };

                    $scope.gotIt = function () {
                        gieLocalStorage.forUser(User.ID).save("disabledLicensurePopup", true);
                    }
                }]
            };
        })

        .run(["SecurityService", "gieLocalStorage", "User", function (SecurityService, gieLocalStorage, User) {
            SecurityService.onLogin(function () {
                var byUser = gieLocalStorage.forUser(User.ID);

                if(byUser.get("disabledLicensurePopup") == null) {
                    byUser.save("disabledLicensurePopup", false);
                }
            })
        }])

        .factory("gieLocalStorage", function() {
            var cache = {};

            function createLocalStorage(storageKey) {
                var data = cache[storageKey];
                if(data == null) {
                    var dataStorage = localStorage[storageKey];
                    if(dataStorage != null) {
                        data = JSON.parse(dataStorage);
                    }
                    if(data == null) {
                        data = {};
                    }
                    cache[storageKey] = data;
                }
                return {
                    save: function (key, value) {
                        data[key] = value;
                        localStorage[storageKey] = JSON.stringify(data);
                    },
                    get : function (key) {
                        return data[key];
                    }
                }
            }

            return {
                forUser : function (userId) {
                    return createLocalStorage(userId);
                }
            };
        })
    ;

})();