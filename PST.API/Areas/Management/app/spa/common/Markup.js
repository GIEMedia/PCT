"use strict";

(function () {

    angular.module('pct.markup', [
    ])
        .directive("markupEditor", function() {

            var selected;

            function getPopupTextStyle() {
                var ret = $(".popup-text-style");
                if (ret.length == 0) {
                    ret = $("<div class=\"popup-text-style\">" +
                                "<i class=\"btn btn-grey fa fa-bold\"></i>" +
                                "<i class=\"btn btn-grey fa fa-italic\"></i>" +
                                "<i class=\"btn btn-grey fa fa-underline\"></i>" +
                            "</div>");

                    var modText = function(letter) {
                        if (selected && selected.$element && selected.$element.length > 0) {
                            var text = selected.$element.val();
                            text = text.substring(0, selected.end) + '[/' + letter + ']' + text.substring(selected.end);
                            text = text.substring(0, selected.start) + '[' + letter + ']' + text.substring(selected.start);
                            selected.$element.val(text);
                            selected.$ctrl.$setViewValue(text);
                            selected = null;
                            ret.hide();
                        }
                    };

                    ret.find('.fa-bold').on('click', function () { modText('b'); });
                    ret.find('.fa-italic').on('click', function () { modText('i'); });
                    ret.find('.fa-underline').on('click', function () { modText('u'); });

                    $("body").append(ret);
                    return ret;
                } else {
                    return ret;
                }
            }

            return {
                restrict: "A",
                require: "ngModel",
                link: function($scope, elem, attrs, ngModelCtrl) {
                    var $popup = getPopupTextStyle();
                    elem.on('updateInfo keyup mousedown mouseup', function () {
                        var range = $(this).textrange();
                        if (!selected || range.text != selected.text) {
                            selected = range;
                            selected.$element = elem;
                            selected.$ctrl = ngModelCtrl;
                        }
                        if (selected.text) {
                            $popup.show();
                            var offset = $(this).offset();
                            $popup.css('top', offset.top - $('.popup-text-style').outerHeight() - 8);
                            $popup.css('left', offset.left);
                        } else
                            $popup.hide();
                    });

                }
            };
        })

    ;
})();