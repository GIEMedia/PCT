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

        .directive("pctOptions", ["$parse", function($parse) {
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

                    var neverSelected = true;

                    var model = $parse(attrs.pctModel);

                    var list = null;
                    var match = /^(.+?) as (.+?) for (.+?) in (.+?)$/.exec(attrs.pctOptions);

                    var valueM = parse(match[1]);
                    var textM = parse(match[2]);
                    var listExp = match[4];

                    var updatingView = false;
                    var updateV = function (value) {
                        var control = elem.data("selectBox-selectBoxIt");

                        var index = (value == null && attrs.nullOption) ? -1 : Cols.indexOf(value, list, valueM);
                        //console.log("Index: " + index + ", currentFocus: " + control.currentFocus);

                        if (index != -1 || (value == null && attrs.nullOption)) {
                            if (attrs.nullOption) {
                                index += 1;
                            }

                            if (neverSelected || index != control.currentFocus) { // Force change when neverSelected because it maybe the defaultText (==0)
                                updatingView = true;
                                control.selectOption(index);
                                updatingView = false;
                                //console.log("Go to index: " + index);
                                neverSelected = false;
                            }
                        }
                    };


                    $scope.$watch(listExp, function(listVal) {
                        //console.log("Changed " + listVal + " list=" + list);
                        if (listVal == list) {
                            return;
                        }
                        var control = elem.data("selectBox-selectBoxIt");

                        if (Cols.isNotEmpty(list)) {
                            control.remove();
                            //console.log("Removed all elements");
                        }

                        list = listVal;
                        neverSelected = true;
                        if (listVal == null) {
                            return;
                        }

                        if (attrs.nullOption) {
                            control.add({value: null, text: attrs.nullOption});
                        }
                        control.add(Cols.yield(listVal, function(e) {
                            var value = valueM(e);
                            var text = textM(e);
                            return {value: value, text: text};
                        }));

                        // Populate current value
                        var value = model($scope);
                        updateV(value);

                    });

                    var currentValue = function() {
                        var control = elem.data("selectBox-selectBoxIt");
                        var index = control.currentFocus;

                        if (attrs.nullOption) {
                            index -= 1;
                        }

                        if (index == -1) {
                            return null;
                        }
                        return valueM(list[index]);
                    };

                    elem.bind({
                        "change": function(ev, obj) {
                            if (updatingView) {
                                return;
                            }
                            var vValue = currentValue();
                            $scope.$applyAsync(function() {
                                //console.log("Change model to " + vValue);
                                model.assign($scope, vValue);
                            });
                        }
                    });

                    //console.log("Watch registered");
                    $scope.$watch(attrs.pctModel, updateV);
                    //if (!$scope.$$phase) $scope.$digest();
                }
            };
        }])

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

        .directive("pctFocus", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    $scope.$watch(attrs.pctFocus, function(value) {
                        if (value) {
                            setTimeout(function(){
                                elem.focus();
                            }, 0);
                        }
                    });
                }
            };
        })

        .directive("sortable", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    elem.sortable({
                        handle: ".sortable-handle",
                        items: "[sortable-row-index]",
                        start: function() {
                            if (attrs.beforeSorting) {
                                $scope.$apply(attrs.beforeSorting);
                            }
                        },
                        update: function() {
                            var indice = [];
                            elem.find("[sortable-row-index]").each(function() {
                                indice.push($(this).attr("sortable-row-index") * 1);
                            });
                            $scope.$applyAsync(function() {
                                $scope.$eval(attrs.sortable, {"$indice": indice});
                            });
                        }
                    });
                    //if (attrs.beforeSorting) {
                    //    elem.find(".sortable-handle").mousedown(function() {
                    //        console.log(111);
                    //        $scope.$apply(attrs.beforeSorting);
                    //    });
                    //}
                }
            };
        })
    

        .factory("Hover", function() {
            return {
                link: function($scope, elem, attrs) {

                    elem.on('mouseenter', function () {
                        $(this).addClass('hovered');
                    }).on('mouseleave', function() {
                        $(this).removeClass('hovered');
                    });
                }

            };
        })

        .directive("pctNoRecord", function() {
            return {
                restrict: "A",
                scope: true,
                link: function($scope, elem, attrs) {
                    $scope.$watch(function() {
                        var map = $scope.$eval(attrs.pctNoRecord);
                        if (map.list == null) {
                            return 1;
                        } else if (map.list.length == 0) {
                            return "No " + map.name + " available";
                        } else if (map.searchResult != null && map.searchResult.length == 0 ) {
                            return "No " + map.name + " found matching \"<b>" + map.search + "</b>\"";
                        } else if (map.searchResult == null && StringUtil.isNotEmpty(map.search) ) {
                            return "Searching for \"<b>" + map.search + "</b>\"";
                        } else {
                            return 0;
                        }
                    }, function(value) {
                        if (value == 0) {
                            elem.hide();
                        } else {
                            elem.show();
                            if (value == 1) {
                                $scope.messageComponent.removeClass("no-record");
                                $scope.messageComponent.addClass("loading");
                                $scope.messageComponent.html("Loading...");
                            } else {
                                $scope.messageComponent.removeClass("loading");
                                $scope.messageComponent.addClass("no-record");
                                $scope.messageComponent.html(value);
                            }
                        }
                    });

                },
                controller: ["$scope", function($scope) {
                    this.setMessageComponent = function(comp) {
                        $scope.messageComponent = comp;
                    }
                }]
            };
        })

        .directive("pctNoRecordMessage", function() {
            return {
                restrict: "A",
                require: "^pctNoRecord",
                link: function($scope, elem, attrs, upCtrl) {
                    upCtrl.setMessageComponent(elem);
                }
            };
        })
    ;

})();