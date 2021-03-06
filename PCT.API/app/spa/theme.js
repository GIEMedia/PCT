"use strict";

(function (a) { (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego|ipad|playbook|silk).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)) })(navigator.userAgent || navigator.vendor || window.opera);

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
        
        .directive("questionTooltip", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    if (!$.browser.mobile) {
                        elem.hover(
                            function() {
                                elem.addClass("focus");
                            },
                            function() {
                                elem.removeClass("focus");
                            }
                        );
                        elem.click(function() {
                            elem.toggleClass("focus");
                        });
                        
                    } else {
                        elem.click(function() {
                            elem.toggleClass("focus");
                        });
                        
                        setTimeout(function() {
                            elem.next(".popup").click(function(ev) {
                                ev.preventDefault();
                                ev.stopPropagation();
                                elem.removeClass("focus");
                                return false;
                            });
                        }, 0);
                    }
                }
            };
        })

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

        .filter('mathFloor', function () {
            return function (num) {
                return Math.floor(num);
            }
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
    ;

})();