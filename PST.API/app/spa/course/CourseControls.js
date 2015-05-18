"use strict";

(function () {

    angular.module('pct.elearning.course.controls', [
        'pct.help'
    ])

        .directive("courseControls", function() {
            return {
                restrict: "C",
                scope: true,
                link: function($scope, elem, attrs) {
                    elem.find(".course-control-print").click(function() {
                        var newWindow = window.open($scope.section.document.pdf_url, "_blank");
                        newWindow.print();
                    });
                }
            };
        })

        .directive("coursePaging", function() {
            return {
                restrict: "C",
                scope: true,
                link: function($scope, elem, attrs) {
                    $scope.currentPage = function() {
                        if ($scope.section==null || $scope.section.document.pages == null) {
                            return 1;
                        }
                        return $scope.section.document.pages.indexOf($scope.page) + 1;
                    };
                }
            };
        })

        /**
         * Handle changing page
         */
        .directive("coursePageController", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    $scope.page = null;
                    $scope.$watch("section", function(value) {
                        if (value && $scope.section.document.pages) {
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

        /**
         * For mobile view, switch between section/questions panel and the document
         */
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
                    }

                    elem.on('click', function(e) {
                        swap();
                        scrollTo(".course-media-bar");
                        e.preventDefault();
                    })
                }
            };
        })

        /**
         * Handing showing document page
         */
        .directive("courseMedia", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    var reset = null;
                    $scope.$watch("section", function() {
                        if (reset) reset();
                    });

                    var pdfPreviewLoaded = function () {
                        var $panZoom = elem.find(".course-media-frame-panzoom").panzoom({
                            contain: 'invert',
                            $zoomOut: elem.find('.course-zoom-out'),
                            $zoomIn: elem.find('.course-zoom-in')
                            //relative: true,
                            //minScale: 1
                        });

                        reset = function() {
                            $panZoom.panzoom("reset");
                            elem.find('.course-zoom-level').text('100%');
                        };

                        $panZoom.on('panzoomzoom', function (e, panzoom, matrix, changed) {
                            if (changed) {
                                elem.find('.course-zoom-level').text(Math.round(100 * matrix) + '%');
                            }
                        });

                        var scrollOnMousewheel = function(e) {
                            e.preventDefault();
                            var delta = e.delta || e.originalEvent.wheelDelta;
                            if (typeof (delta) === "undefined") {
                                delta = e.originalEvent.detail * -1;
                            }

                            var down = delta ? delta < 0 : e.originalEvent.deltaY > 0;
                            $panZoom.panzoom('pan', 0, 15 * (down ? -1 : 1), { relative: true });
                        }

                        $panZoom.parent()
                            .on('mousewheel.focal', function(e) {
                                scrollOnMousewheel(e);
                            })
                            .on('DOMMouseScroll', function (e) {
                                scrollOnMousewheel(e);
                            });

                        elem.find('.course-media-frame .loading').hide();
                    };

                    $scope.$watch(attrs.courseMedia, function(src) {
                        if (src==null) {
                            return;
                        }
                        elem.find(".course-pdf-preview").attr("src", src).one("load", pdfPreviewLoaded).each(function () {
                            if (this.complete) $(this).load();
                        });
                    });
                }
            };
        })

        /**
         * Provide parent controller for courseControlMaximize
         */
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

        /**
         * Maximize the document page, hide section/questions panel
         */
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