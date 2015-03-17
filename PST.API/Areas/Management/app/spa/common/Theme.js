"use strict";

(function () {

    angular.module('pct.management.theme', [
    ])
        .directive("onEnter", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    elem.bind("keydown keypress", function(event) {
                        if(event.which === 13) {
                            $scope.$apply(function(){
                                $scope.$eval(attrs.onEnter, {'event': event});
                            });

                            event.preventDefault();
                        }
                    });
                }
            };
        })

        .directive("buttonLoading", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    var oldHtml;
                    var changed = false;
                    $scope.$watch(attrs.buttonLoading, function(value) {
                        if (value) {
                            changed = true;
                            oldHtml = elem.html();
                            elem.html(angular.element("<i class='fa fa-lg fa-spinner fa-pulse'></i>"));
                        } else if (changed) {
                            changed = false;
                            elem.html(oldHtml);
                        }
                    });
                }
            };
        })

        .directive("select", function() {
            return {
                restrict: "E",
                link: function($scope, elem, attrs) {
                    elem.selectBoxIt({
                        autoWidth: false,
                        showFirstOption: false
                    });
                }
            };
        })
    ;

})();