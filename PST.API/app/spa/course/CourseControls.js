"use strict";

(function () {

    angular.module('pct.elearning.course.controls', [
    ])

        .directive("courseMediaBar", function() {
            return {
                restrict: "C",
                link: function($scope, elem, attrs) {
                    $scope.print = function() {
                        var newWindow = window.open($scope.section.document.pdf_url, "_blank");
                        newWindow.print();
                    };
                    $scope.download = function() {
                        window.open($scope.section.document.pdf_url, "_blank");
                    };
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
                        return $scope.section.document.pages.indexOf($scope.page) + 1;
                    };
                }
            };
        })

        .directive("coursePageController", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    $scope.page = null;
                    $scope.$watch("section", function(value) {
                        if (value) {
                            $scope.page = $scope.section.document.pages[0];
                        }
                    });

                    $scope.nextPage = function() {
                        var indexOf = $scope.section.document.pages.indexOf($scope.page);
                        if (indexOf >= $scope.section.document.pages.length - 1) {
                            return;
                        }
                        $scope.page = $scope.section.document.pages[indexOf + 1];
                        return false;
                    };
                    $scope.prevPage = function() {
                        var indexOf = $scope.section.document.pages.indexOf($scope.page);
                        if (indexOf == 0) {
                            return;
                        }
                        $scope.page = $scope.section.document.pages[indexOf - 1];
                        return false;
                    };

                }
            };
        })

        .directive("courseSwitch", function() {
            return {
                restrict: "C",
                link: function($scope, elem, attrs) {
                    var $course = $('.course');
                    var swap = function() {
                        $course.toggleClass('course-swapped');
                    };

                    function scrollTo(scrollToElement, scrollingElement) {
                        if (!scrollingElement)
                            scrollingElement = 'html, body';
                        $(scrollingElement).animate({
                            scrollTop: $(scrollToElement).offset().top
                        }, 200);
                    };

                    elem.on('click', function(e) {
                        swap();
                        scrollTo(".course-media-bar");
                        e.preventDefault();
                    })
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

        .directive("helpContainer", ["PreferenceService", function(PreferenceService) {
            return {
                restrict: "C",
                templateUrl: "/app/spa/course/CourseHelp.html",
                link: function($scope, elem, attrs) {
                    elem.find('.popup[step] button').click(function () {
                        var step = parseInt($(this).closest('.popup[step]').attr('step'));
                        elem.find('.popup[step="' + step + '"]:visible').removeClass('open');
                        elem.find('.popup[step="' + (step + 1) + '"]:visible').addClass('open');
                    });

                    elem.find('.help-wrapper button').click(function() {
                        elem.find('#helpClose').toggleClass('open');
                    });
                    elem.find('#helpClose button').click(function () {
                        elem.find('.open').removeClass('open');
                    });
                    elem.find('#helpClose button.no').click(function () {
                        PreferenceService.setHelpEnabled(false);
                    });

                }
            };
        }])

        .directive("courseMaximizer", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {

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
                },
                controller: ["$scope", function($scope) {

                    $scope.maximized = false;

                    var ctrl = this;
                    ctrl.isMaximized = function() {
                        return $scope.maximized;
                    };
                    ctrl.setMaximized = function(maximized) {
                        $scope.maximized = maximized;
                    };

                }]
            };
        })

        .directive("courseControlMaximize", function() {
            return {
                restrict: "C",
                require: "^courseMaximizer",
                link: function($scope, elem, attrs, courseMaximizerCtrl) {
                    $scope.$watch(function() { return courseMaximizerCtrl.isMaximized();}, function(maximized) {
                        if (maximized) {
                            elem.addClass('maximized');
                        } else {
                            elem.removeClass('maximized');
                        }
                    });

                    $scope.toggleMaximized = function() {
                        courseMaximizerCtrl.setMaximized(!courseMaximizerCtrl.isMaximized());
                        return false;
                    };
                }
            };
        })
    ;

})();