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
                    var sepaIndex = attrs.buttonLoading.indexOf(":");
                    var size = "lg";
                    var watch;
                    if (sepaIndex > -1) {
                        watch = attrs.buttonLoading.substring(0, sepaIndex);
                        size = attrs.buttonLoading.substring(sepaIndex + 1);
                    } else {
                        watch = attrs.buttonLoading;
                    }

                    $scope.$watch(watch, function(value) {
                        if (value) {
                            changed = true;
                            oldHtml = elem.html();
                            elem.html(angular.element("<i class='fa " + (size=="lg" ? "fa-lg " : "") + "fa-spinner fa-pulse'></i>"));
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
                    var selectBoxContainer = $("<span></span>");
                    var label = $("<input class='field' readonly='readonly' placeholder='Select...' style='display: none'>");
                    var selectBox = $("<select></select>");
                    selectBoxContainer.append(selectBox);
                    elem.append(selectBoxContainer);
                    elem.append(label);

                    if (attrs.pctDisabled) {
                        $scope.$watch(attrs.pctDisabled, function(disabled) {
                            if (disabled) {
                                label.show();
                                selectBoxContainer.hide();
                            } else {
                                label.hide();
                                selectBoxContainer.show();
                            }
                        });

                    }

                    selectBox.selectBoxIt({
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
                        var control = selectBox.data("selectBox-selectBoxIt");

                        var index = (value == null && attrs.nullOption) ? -1 : Cols.indexOf(value, list, valueM);
                        //console.log("Index: " + index + ", currentFocus: " + control.currentFocus);

                        if (index != -1 || (value == null && attrs.nullOption)) {
                            if (attrs.nullOption) {
                                index += 1;
                            }

                            if (neverSelected || index != control.currentFocus) { // Force change when neverSelected because it maybe the defaultText (==0)
                                updatingView = true;

                                control.selectOption(index);
                                label.val(list == null ? "" : textM(list[index]));
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
                        var control = selectBox.data("selectBox-selectBoxIt");

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
                        var control = selectBox.data("selectBox-selectBoxIt");
                        var index = control.currentFocus;

                        if (attrs.nullOption) {
                            index -= 1;
                        }

                        if (index == -1) {
                            return null;
                        }
                        return valueM(list[index]);
                    };

                    selectBox.bind({
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

        .directive("expandingTable", function() {
            return {
                restrict: "A",
                scope: true,
                link: function($scope, elem, attrs) {

                    // Table states dropdown
                    elem.find('.table-row-1').on('click', function (e) {
                        $(this).hide();
                        elem.find('.table-expand').stop(true, true).slideDown(200);

                        e.preventDefault();
                    });

                    var close = function () {
                        setTimeout(function () {
                            elem.find('.table-row-1').show();
                        }, 200);
                        elem.find('.table-expand').stop(true, true).slideUp(200);
                    };
                    $scope.close = close;
                    elem.find('.icon-chevron-up').on('click', function(e) {
                        close();
                        e.preventDefault();
                    });
                },
                controller: ["$scope", function($scope) {
                    this.close = function() {
                        $scope.close();
                    }
                }]
            };
        })

        .directive("expandingTableClose", function() {
            return {
                restrict: "A",
                require: "^expandingTable",
                link: function($scope, elem, attrs, expandingTableCtrl) {

                    elem.on('click', function(e) {
                        expandingTableCtrl.close();
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

        .directive("numberOnly", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    elem.numeric(attrs.numberOnly == null ? null : $scope.$eval(attrs.numberOnly));
                }
            };
        })

        .directive("autofocus", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    setTimeout(function() {
                        elem.focus();
                    }, 0);
                }
            };
        })
    ;
})();