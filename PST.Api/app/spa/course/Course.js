"use strict";

(function () {

    angular.module('pct.elearning.course', [
        'pct.elearning.course.slider',
        'pct.elearning.course.questions',
        'pct.elearning.course.questionsContainer',
        'ui.router'
    ])

        .config(function ($stateProvider) {

            $stateProvider
                .state('course', {
                    url: '/course',
                    templateUrl: "/app/spa/course/CoursePage.html",
                    controller: "course.Ctrl"
                })
            ;
        })

        .controller("course.Ctrl", function ($scope, CourseService, UserCourseService) {
            $scope.course = CourseService.get({}, function() {
            });
            $scope.userProgress = UserCourseService.getProgress();
            $scope.courseHelp = false;
        })

        .directive("course", function() {
            return {
                restrict: "C",
                templateUrl: "/app/spa/course/Course.html",
                controller: function($scope) {
                    $scope.maximized = false;

                    var ctrl = this;
                    ctrl.isMaximized = function() {
                        return $scope.maximized;
                    };
                    ctrl.setMaximized = function(maximized) {
                        $scope.maximized = maximized;
                    };

                    // Section navigation
                    ctrl.gotoSection = function(sectionNum) {
                        $scope.section = $scope.course.sections[sectionNum - 1];
                        $scope.page = $scope.section.pages[0];
                        if (!$scope.$$phase) $scope.$digest();
                    };
                    ctrl.nextSection = function() {
                        var indexOf = $scope.course.sections.indexOf($scope.section);
                        if (indexOf == $scope.course.sections.length - 1) {
                            return;
                        }
                        ctrl.gotoSection(indexOf + 1 + 1);
                    };
                    ctrl.prevSection = function() {
                        var indexOf = $scope.course.sections.indexOf($scope.section);
                        if (indexOf == 0) {
                            return;
                        }
                        ctrl.gotoSection(indexOf + 1 - 1);
                    };
                    ctrl.sectionNum = function() {
                        return $scope.course ==null ? 0 : $scope.course.sections.indexOf($scope.section) + 1;
                    };
                },
                link: function($scope, elem, attrs) {
                    $scope.$watch("course", function(course) {
                        if (course) {
                            $scope.section = $scope.course.sections[0];
                            $scope.page = $scope.section.pages[0];
                        }
                    });

                    $scope.$watch("maximized", function(maximized) {
                        if (maximized) {
                            elem.addClass('course-maximized');
                        } else {
                            elem.removeClass('course-maximized');

                            setTimeout(function() {
                                elem.find('.course-questions-container').getNiceScroll().resize();
                            }, 100);
                        }
                    });

                    $scope.nextPage = function() {
                        var indexOf = $scope.section.pages.indexOf($scope.page);
                        if (indexOf >= $scope.section.pages.length - 1) {
                            return;
                        }
                        $scope.page = $scope.section.pages[indexOf + 1];
                        return false;
                    };
                    $scope.prevPage = function() {
                        var indexOf = $scope.section.pages.indexOf($scope.page);
                        if (indexOf == 0) {
                            return;
                        }
                        $scope.page = $scope.section.pages[indexOf - 1];
                        return false;
                    };

                    $scope.print = function() {
                        var newWindow = window.open($scope.course.pdfUrl, "_blank");
                        newWindow.print();
                    };
                    $scope.download = function() {
                        window.open($scope.course.pdfUrl, "_blank");
                    };
                }
            };
        })

        .directive("courseStepsSlides", function() {
            return {
                restrict: "C",
                require: "^course",
                link: function($scope, elem, attrs, courseCtrl) {
                    //<li><a href="#" class="answered" data-tip="Weevils: Facts, Identification &amp; Control">1</a></li>
                    //<li><a href="#" class="answered" data-tip="Weevils: Facts, Identification &amp; Control">2</a></li>
                    //<li><a href="#" class="answered" data-tip="Weevils: Facts, Identification &amp; Control">3</a></li>
                    //<li><a href="#" class="current" data-tip="Weevils: Facts, Identification &amp; Control">4</a></li>
                    //<li><a href="#" data-tip="Weevils: Facts, Identification &amp; Control">5</a></li>

                    var tooltip = function(e, text) {
                        return e.tooltipster({
                            position: 'right',
                            maxWidth: 230,
                            functionBefore: function(origin, continueTooltip) {
                                origin.tooltipster('content', text);
                                continueTooltip();
                            }
                        });
                    };

                    var current = null;

                    var tags = null;
                    $scope.$watch("course", function(course) {
                        if (course) {
                            tags = [];
                            elem.empty();
                            for (var i = 0; i < course.sections.length; i++) {
                                var sec = course.sections[i];
                                var aTag = tooltip($("<a href=\"\" class=\"answered\" ></a>").text(i + 1), sec.name);
                                elem.append($("<li/>").append(
                                    aTag
                                ));
                                aTag.click(function() {
                                    var tag = $(this);
                                    if (tag.hasClass("current")) {
                                        ;
                                    } else {
                                        courseCtrl.gotoSection(tag.text()*1);
                                    }
                                    return false;
                                });
                                tags.push(aTag);
                            }
                        }
                    });

                    $scope.$watch("section", function(section) {
                        var indexOf = $scope.course.sections.indexOf($scope.section);
                        if (indexOf == -1) {
                            return;
                        }
                        var newCurrent = tags[indexOf];

                        if (newCurrent != current) {
                            newCurrent.addClass("current");
                            if (current != null) {
                                current.removeClass("current");
                            }
                            current = newCurrent;
                        }
                    });
                }
            };
        })

        .directive("coursePaging", function() {
            return {
                restrict: "C",
                link: function($scope, elem, attrs) {
                    $scope.currentPage = function() {
                        if ($scope.section==null) {
                            return 1;
                        }
                        return $scope.section.pages.indexOf($scope.page) + 1;
                    };
                }
            };
        })

        .directive("coursePdfPreview", function() {
            return {
                restrict: "C",
                link: function($scope, elem, attrs) {

                    var pdfPreviewLoaded = function () {
                        var $panZoom = $(".course-media-frame-panzoom").panzoom({
                            contain: 'invert',
                            $zoomOut: $('.course-zoom-out'),
                            $zoomIn: $('.course-zoom-in')
                            //relative: true,
                            //minScale: 1
                        });

                        $panZoom.on('panzoomzoom', function (e, panzoom, matrix, changed) {
                            if (changed) {
                                $('.course-zoom-level').text(Math.round(100 * matrix) + '%');
                            }
                        });

                        $panZoom.parent().on('mousewheel.focal', function (e) {
                            e.preventDefault();
                            var delta = e.delta || e.originalEvent.wheelDelta;

                            var down = delta ? delta < 0 : e.originalEvent.deltaY > 0;
                            $panZoom.panzoom('pan', 0, 15 * (down ? -1 : 1), { relative: true });
                        });

                        $('.course-media-frame .loading').hide();
                    };

                    $scope.$watch(attrs.imgSrc, function(src) {
                        if (src==null) {
                            return;
                        }
                        elem.attr("src", src).one("load", pdfPreviewLoaded).each(function () {
                            if (this.complete) $(this).load();
                        });
                    });
                }
            };
        })

        .directive("courseControlMaximize", function() {
            return {
                restrict: "C",
                require: "^course",
                link: function($scope, elem, attrs, courseCtrl) {
                    $scope.$watch(function() { return courseCtrl.isMaximized();}, function(maximized) {
                        if (maximized) {
                            elem.addClass('maximized');
                        } else {
                            elem.removeClass('maximized');
                        }
                    });

                    $scope.toggleMaximized = function() {
                        courseCtrl.setMaximized(!courseCtrl.isMaximized());
                        return false;
                    };
                }
            };
        })

        .directive("helpContainer", function() {
            return {
                restrict: "C",
                templateUrl: "/app/spa/course/CourseHelp.html",
                scope: true,
                link: function($scope, elem, attrs) {
                    elem.find('.popup[step] button').click(function () {
                        var step = parseInt($(this).closest('.popup[step]').attr('step'));
                        $('.help-container .popup[step="' + step + '"]:visible').removeClass('open');
                        $('.help-container .popup[step="' + (step + 1) + '"]:visible').addClass('open');
                    });

                    elem.find('.help-wrapper button').click(function() {
                        $('#helpClose').toggleClass('open');
                    });
                    elem.find('#helpClose button').click(function () {
                        $('.help-container .open').removeClass('open');
                    });

                }
            };
        })
    ;

})();