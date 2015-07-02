"use strict";

(function() {

    angular.module('pct.common.sorter', [
        ])

        .filter("sorterFilter", function() {

            function sort(data, sorter) {
                if (sorter.sortBy == null || data == null) {
                    return data;
                }

                var data1 = [];
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                        data1[i] = data[i];
                    }
                }

                var sortBy = function(r1, r2) {
                    var d1 = r1[sorter.sortBy];
                    var d2 = r2[sorter.sortBy];

                    if (d1 == d2) {
                        return 0;
                    }

                    if (d1 == null) {
                        return -1;
                    }
                    if (d2 == null) {
                        return 1;
                    }

                    if ((typeof d1) == "string") {
                        d1 = d1.toLowerCase();
                    }
                    if ((typeof d2) == "string") {
                        d2 = d2.toLowerCase();
                    }

                    if (d1 == d2) { // Check again after tolowercase
                        return 0;
                    }
                    return d1 > d2 ? 1 : -1;
                };

                data1.sort(sorter.sortAsc ? sortBy : function(r1, r2) {
                    return -1 * sortBy(r1, r2);
                });
                return data1;
            }

            return function(data,sorter) {
                if (data == null) {
                    return null;
                }

                data = sort(data, sorter);

                // Slice
                if (sorter.pageSize > -1 && data.length > sorter.pageSize) {
                    var start = ((sorter.currentPage-1) * sorter.pageSize);
                    var end = start + sorter.pageSize;
                    return data.slice(start, end);
                }

                return data;
            }
        })

        .factory("Sorters", function() {

            var Sorters = {
                create: function() {
                    var sorter = {
                        pageSize: -1,
                        currentPage: 1,
                        sortBy: null,
                        sortAsc: true
                    };

                    return sorter;
                }
            };

            return Sorters;
        })

        .directive("sortBy", function() {
            return {
                link: function($scope, elem, attrs) {
                    var sorter = attrs.sorter ? $scope[attrs.sorter] : $scope.sorter;
                    var a = $("<a href=''/>").html(elem.html());

                    //a.append("&nbsp;");
                    var icon = $("<i>");
                    a.append(icon);

                    $scope.$watch(function() {
                        if (sorter.sortBy != attrs.sortBy) {
                            return 0;
                        }
                        return sorter.sortAsc ? 1 : -1;
                    }, function(code) {
                        icon.attr("class", code == 0 ? "" : code == 1 ? "fa fa-caret-up" : "fa fa-caret-down");
                        //icon.attr("class", code == 0 ? "" : code == 1 ? "fa fa-sort-asc" : "fa fa-sort-desc");
                    });

                    a.click(function() {
                        try {
                            if (sorter.sortBy != attrs.sortBy) {
                                sorter.sortBy = attrs.sortBy;
                                sorter.sortAsc = true;
                            } else {
                                if (sorter.sortAsc) {
                                    sorter.sortAsc = false;
                                } else {
                                    sorter.sortAsc = true;
                                    sorter.sortBy = null;
                                }
                            }
                            sorter.currentPage = 1;

                            //sorter.sort();

                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        return false;
                    });

                    elem.html(a);
                }
            };
        })

    ;

})();