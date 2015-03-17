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
                link: function($scope, elem, attrs, ngModelCtrl) {
                    elem.selectBoxIt({
                        autoWidth: false,
                        defaultText: "Select"
                    });

                }
            };
        })
        .directive("pctOptions", function($parse) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    var model = $parse(attrs.pctModel);

                    var list = null;
                    var match = /^(.+?) as (.+?) for (.+?) in (.+?)$/.exec(attrs.pctOptions);

                    var valueExp = match[1].replace(/.+\./,"");
                    var textExp = match[2].replace(/.+\./,"");
                    var listExp = match[4];

                    $scope.$watch(listExp, function(listVal) {
                        var control = elem.data("selectBox-selectBoxIt");
                        list = listVal;

                        control.remove();
                        if (listVal == null) {
                            return;
                        }
                        Cols.each(listVal, function(e) {
                            var value = e[valueExp];
                            var text = e[textExp];
                            control.add({value: value, text: text});
                        });

                        // Populate current value
                        var value = model($scope);

                        var index = Cols.indexOf(value, list, function (e) {
                            return e[valueExp];
                        });
                        if (index != -1) {
                            control.selectOption(index);
                        }
                    });

                    elem.bind({
                        "change": function(ev, obj) {
                            var control = elem.data("selectBox-selectBoxIt");
                            model.assign($scope, list[control.currentFocus][valueExp]);
                            if (!$scope.$$phase) $scope.$digest();
                        }
                    })
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