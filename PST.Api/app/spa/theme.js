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
        .directive("select", function() {
            return {
                restrict: "E",
                link: function($scope, elem, attrs) {
                    setTimeout(function() {
                        elem.selecter({
                            label: elem.attr('placeholder')
                        });
                    }, 0);
                }
            };
        })

        .directive("navContainer", function($rootScope) {
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
        })

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

    ;

})();