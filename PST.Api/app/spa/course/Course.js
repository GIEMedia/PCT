"use strict";

(function () {

    angular.module('pct.elearning.course', [
        'pct.elearning.course.slider',
        'pct.elearning.course.questionsContainer',
        'ui.router'
    ])

        .config(function ($stateProvider) {

            $stateProvider
                .state('course', {
                    url: '/course/:id',
                    templateUrl: "/app/spa/course/CoursePage.html",
                    controller: "course.Ctrl"
                })
            ;
        })

        .controller("course.Ctrl", function ($scope, CourseService, $stateParams, PreferenceService) {
            CourseService.get($stateParams.id).success(function(course) {
                $scope.course = course;
            });
            CourseService.getProgress($stateParams.id, function(progress) {
                $scope.progress = progress;
            });

            $scope.courseHelp = PreferenceService.isHelpEnabled();
        })

        .directive("course", function() {
            return {
                restrict: "C",
                templateUrl: "/app/spa/course/Course.html",
                controller: function($scope) {

                    var ctrl = this;
                    // Section navigation
                    ctrl.gotoSection = function(sectionNum) {
                        $scope.section = $scope.course.sections[sectionNum - 1];
                        $scope.page = $scope.section.document.pages[0];
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

                    // Section query
                    ctrl.finishedAllSection = function() {
                        if ($scope.course == null || $scope.progress == null) {
                            return false;
                        }

                        for (var i = 0; i < $scope.course.sections.length; i++) {
                            var sec = $scope.course.sections[i];
                            if (!($scope.progress[sec.section_id] >= sec.questions.length)) {
                                return false;
                            }
                        }
                        return true;
                    };

                    // Change to next unfinished section
                    $scope.nextUnfinishedSection = function() {
                        for (var i = 0; i < $scope.course.sections.length; i++) {
                            var sec = $scope.course.sections[i];
                            if (!($scope.progress[sec.section_id] >= sec.questions.length)) {
                                ctrl.gotoSection(i+1);
                                return true;
                            }
                        }
                        return false;
                    };
                    ctrl.nextUnfinishedSection = $scope.nextUnfinishedSection;
                },
                link: function($scope, elem, attrs) {

                    var waitProgress = Async.ladyFirst();

                    $scope.$watch("progress", function(value) {
                        if (value) {
                            waitProgress.ladyDone();
                        }
                    });



                    $scope.$watch("course", function(course) {
                        if (course) {
                            waitProgress.manTurn(function() {
                                var hasSection = $scope.nextUnfinishedSection();
                                if (!hasSection) {
                                    $scope.section = $scope.course.sections[0];
                                }
                                $scope.page = $scope.section.document.pages[0];
                            });
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

        .directive("helpContainer", function(PreferenceService) {
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
        })

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
                controller: function($scope) {

                    $scope.maximized = false;

                    var ctrl = this;
                    ctrl.isMaximized = function() {
                        return $scope.maximized;
                    };
                    ctrl.setMaximized = function(maximized) {
                        $scope.maximized = maximized;
                    };

                }
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