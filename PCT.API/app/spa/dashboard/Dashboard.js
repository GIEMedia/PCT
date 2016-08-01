
(function () {

    angular.module('pct.elearning.dashboard', [
        'ui.router'
    ])

        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('dashboard', {
                    url: '/dashboard?firstLogin',
                    templateUrl: "/app/spa/dashboard/Dashboard.html?v=" + htmlVer,
                    controller: "dashboard.Ctrl"
                })
            ;
        }])

        .controller("dashboard.Ctrl", ["$scope", "$state", "$stateParams", "User", "CourseService", "DashboardHelper", function ($scope, $state, $stateParams, User,
                                                                                                                                 CourseService, DashboardHelper) {
            $scope.User = User;
            $scope.firstLogin = $stateParams.firstLogin;

            CourseService.getNewCourses().success(function(courses) {
                $scope.newCourses = courses;
            });
            CourseService.getOpenCourses().success(function(openCourses) {
                $scope.openCourses = openCourses;
            });

            $scope.courseStructure = null;
            CourseService.getCourseStructure().success(function(cs1) {
                $scope.courseStructure = cs1;

                $scope.courseHeaderCols = DashboardHelper.toCols(DashboardHelper.filter($scope.courseStructure, $scope.view.search));
            });

            $scope.view = {
                search: null
            };

            $scope.$watch("view.search", function(search) {
                $scope.courseHeaderCols = DashboardHelper.toCols(DashboardHelper.filter($scope.courseStructure, search));
            });

            $scope.getTestProgress = function (course) {
              var openCourse = Cols.find($scope.openCourses, function (openCourse) {
                  return openCourse.course_id == course.course_id;
              });

              return openCourse && openCourse.course_progress == 1 ? openCourse.test_progress : null;
            };

            /**
             * This is invoked when user click on a new course (either in the New Courses list or in the search dropdown).
             * This will load the desired course, to check if the server will allow that course to be loaded when user proceed to the Course Page.
             * @param course
             */
            $scope.loadCourse = function(course) {
                CourseService.get(course.course_id).success(function(resp) {
                    if (resp.prerequisite_courses) {
                        alert("You need to finish these courses first: " + Cols.join(Cols.yield(resp.prerequisite_courses, function(pc) { return pc.title;}), ", "));
                    } else {
                        $state.go("course", {id: course.course_id});
                    }
                });
            };

        }])

        /**
         * Provide helper functions for processing search text box.
         * Filter out all courses that does not contain the text in the search box.
         * Filter out all categories that does not have any courses (because no course match the 1st condition).
         * Filter out all headers that does not have any categories (because no categories match the 2nd condition).
         */
        .factory("DashboardHelper", function() {
            return {
                /**
                 * Take in the headers with their full structure, then filter out all courses which does not contain the search text.
                 * All resulted empty categories and headers are filtered out too.
                 * @param _headers
                 * @param search
                 * @returns {*}
                 */
                filter: function(_headers, search) {
                    if (StringUtil.isBlank(search)) {
                        return _headers;
                    }
                    var lowerSearch = search.toLowerCase();

                    var filterCat = function(cat) {
                        var courses = Cols.filter(cat.courses, function(course) {
                            return course.title.toLowerCase().indexOf(lowerSearch) > -1;
                        });
                        if (Cols.isEmpty(courses)) {
                            return null;
                        }

                        return {title: cat.title, courses: courses};
                    };


                    var headers = [];
                    for (var i = 0; i < _headers.length; i++) {
                        var categories = Cols.yield(_headers[i].categories, filterCat);

                        if (Cols.isEmpty(categories)) {
                            continue;
                        }

                        headers.push({title: _headers[i].title, categories: categories});
                    }
                    return headers;
                },
                /**
                 * Divide 1 collection to 2, cut in the middle, or the later one is 1 element longer.
                 * @param list
                 * @returns 1 list with 2 elements, each one is 1 list
                 */
                toCols: function(list) {
                    if (Cols.isEmpty(list)) {
                        return null;
                    }
                    if (list.length == 1) {
                        return [[list[0]]];
                    }

                    var middle = Math.floor(list.length / 2);
                    return [list.slice(0, middle), list.slice(middle, list.length)];
                }
            };
        })

        /**
         * Control the search text box, the wrapper div and the search dropdown
         */
        .directive("searchField", ["$parse", function($parse) {
            return {
                restrict: "C",
                scope: true,
                link: function($scope, elem, attrs) {

                    var $search = elem.parent();

                    var allowSearch = $parse(attrs.allowSearch);

                    elem.on('click', function (e) {
                        if (!allowSearch($scope)) {
                            return;
                        }
                        $search.toggleClass('search-expanded');
                        $scope.clearSearchText();
                        e.preventDefault();
                    });

                    var wrapperOnClick = function (e) {
                        var $clicked = $(e.target);

                        if ( !$clicked.closest($search).length && !$clicked.is($search) ) {
                            $search.removeClass('search-expanded');
                            $scope.clearSearchText();
                        }
                    };

                    var wrapper = $('.wrapper');
                    wrapper.on('click', wrapperOnClick);

                    $scope.$on("$destroy", function() {
                        wrapper.off('click', wrapperOnClick);
                    });
                },
                controller: ["$scope", function($scope) {
                    var ctrl = this;
                    ctrl.setClearTextF = function(clearTextF) {
                        $scope.clearSearchText = clearTextF;
                    };
                }]

            };
        }])

        /**
         * Register the search input box to the search field (which handle the search dropdown).
         */
        .directive("searchInput", function() {
            return {
                require: ["ngModel", "^searchField"],
                link: function($scope, elem, attrs, ctrls) {
                    var ngModelCtrl = ctrls[0];
                    var searchFieldCtrl = ctrls[1];

                    searchFieldCtrl.setClearTextF(function() {
                        ngModelCtrl.$setViewValue('');
                        elem.val('');
                    });
                }
            };
        })

        .directive("searchSection", function() {
            return {
                restrict: "E",
                templateUrl: "app/spa/dashboard/search-section.html?v=" + htmlVer,
                controller: ["$scope", function($scope) {}]
            };
        })
    ;

})();


