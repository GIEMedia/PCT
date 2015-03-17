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

        //.directive("select", function() {
        //    return {
        //        restrict: "E",
        //        link: function($scope, elem, attrs, ngModelCtrl) {
        //            elem.selectBoxIt({
        //                autoWidth: false,
        //                defaultText: "Select"
        //            });
        //
        //        }
        //    };
        //})
        .directive("pctOptions", function($parse) {
            var parse = function(exp) {
                var getter;
                if (exp.indexOf(".") == -1) {
                    getter = function (o) {return o;};
                } else {
                    var cut = exp.replace(/.+\./,"");
                    getter = function (o) {return o[cut];};
                }

                return getter;
            };

            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    elem.selectBoxIt({
                        autoWidth: false,
                        defaultText: "Select..."
                    });

                    var model = $parse(attrs.pctModel);

                    var list = null;
                    var match = /^(.+?) as (.+?) for (.+?) in (.+?)$/.exec(attrs.pctOptions);

                    var valueM = parse(match[1]);
                    var textM = parse(match[2]);
                    var listExp = match[4];

                    var updateV = function (value) {
                        var control = elem.data("selectBox-selectBoxIt");

                        var index = Cols.indexOf(value, list, valueM);
                        if (index != -1 && index != control.currentFocus) {
                            control.selectOption(index);
                        }
                    };


                    $scope.$watch(listExp, function(listVal) {
                        var control = elem.data("selectBox-selectBoxIt");
                        list = listVal;

                        control.remove();
                        if (listVal == null) {
                            return;
                        }
                        Cols.each(listVal, function(e) {
                            var value = valueM(e);
                            var text = textM(e);
                            control.add({value: value, text: text});
                        });

                        // Populate current value
                        var value = model($scope);
                        updateV(value);
                        //var index = Cols.indexOf(value, list, valueM);
                        //if (index != -1 && index != control.currentFocus) {
                        //    control.selectOption(index);
                        //}
                    });

                    elem.bind({
                        "change": function(ev, obj) {
                            var control = elem.data("selectBox-selectBoxIt");
                            $scope.$applyAsync(function() {
                                model.assign($scope, valueM(list[control.currentFocus]));
                            });
                        }
                    });

                    $scope.$watch(attrs.pctModel, updateV);
                }
            };
        })

        .directive("tableStates", function() {
            return {
                restrict: "C",
                link: function($scope, elem, attrs) {

                    // Table states dropdown
                    elem.find('.table-row-1').on('click', function (e) {
                        $(this).hide();
                        elem.find('.table-expand').stop(true, true).slideDown(200);

                        e.preventDefault();
                    });

                    elem.find('.icon-chevron-up').on('click', function (e) {
                        setTimeout(function () { elem.find('.table-row-1').show(); }, 200);
                        elem.find('.table-expand').stop(true, true).slideUp(200);

                        e.preventDefault();
                    });
                }
            };
        })
    ;

})();