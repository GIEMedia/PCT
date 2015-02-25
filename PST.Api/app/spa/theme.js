"use strict";

(function () {

    angular.module('pct.elearning.theme', [
    ])
        .directive("isScrollable", function() {
            return {
                restrict: "C",
                link: function($scope, elem, attrs) {
                    if (!$.browser.mobile) {
                        elem.niceScroll({
                            cursorcolor : '#606060',
                            cursoropacitymin: 0.3,
                            cursorborder: false,
                            enablescrollonselection: false,
                            railoffset: {
                                left: -2
                            },
                            railpadding: {
                                top: 2,
                                bottom: 2
                            }
                        });
                    }
                }
            };
        })
        .directive("formstoneSelecter", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    setTimeout(function() {
                        elem.selecter({
                            label: elem.attr('placeholder')
                        });
                    }, 0);
                }
            };
        })

        .directive("navContainer", ["$rootScope", function($rootScope) {
            return {
                restrict: "C",
                link: function($scope, elem, attrs) {
                    var $nav               = elem;

                    $('.nav-toggle').on('click', function(e) {
                        $nav.toggleClass('open');
                        e.preventDefault();
                    });

                    $('.wrapper').on('click', function(e) {
                        var $clicked = $(e.target);

                        if (!$clicked.closest($nav).length && !$clicked.is($nav)) {
                            $nav.removeClass('open');
                        }
                    });


                    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                        $nav.removeClass('open');
                    })
                }
            };
        }])

        .directive("video", function() {
            return {
                restrict: "E",
                link: function($scope, elem, attrs) {
                    //<source ng-repeat="(format,src) in question.video" src="{{src}}" type='video/{{format}}'>
                    $scope.$watch(attrs.source, function(source) {
                        if (source) {
                            for (var format in source) {
                                var src = source[format];
                                elem.append("<source src=\"" + src + "\" type='video/" + format + "'>");
                            }
                        }
                    });
                }
            };
        })


        .directive("equals", function() {
            return {
                require: "ngModel",
                link: function($scope, element, attrs, ngModel) {
                    var _value;
                    ngModel.$validators.equals = function(modelValue) {
                        return modelValue == _value;
                    };

                    $scope.$watch(attrs.equals, function(value) {
                        _value = value;
                        ngModel.$validate();
                    });
                }
            };
        })

        .directive("eFocus", ["$parse", function($parse) {
            return {
                restrict: "A",
                scope: false,
                link: function($scope, elem, attrs) {
                    var focusModel = $parse(attrs.eFocus);

                    $scope.$watch(attrs.eFocus, function(value) {
                        if (value) {
                            elem.focus();
                            focusModel.assign($scope, false);
                        }
                    });

                }
            };
        }])

        .directive("numberOnly", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    $(elem).keydown(function(e) {
                        if (e.ctrlKey || e.altKey || e.metaKey) {
                            return true;
                        }

                        var keyCode = e.keyCode;
                        if (keyCode == 32) { // Space
                            return false;
                        } else if (keyCode >= 65 && keyCode <= 90) {
                            return false;
                        }
                        return true;
                    });
                }
            };
        })
    ;

})();