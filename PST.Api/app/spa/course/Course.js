"use strict";

(function () {

    angular.module('pct.elearning.course', [
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

        .controller("course.Ctrl", function ($scope) {
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
                },
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


                    var pdfPreviewLoaded = function () {
                        var $panZoom = elem.find(".course-media-frame-panzoom").panzoom({
                            contain: 'invert',
                            $zoomOut: $('.course-zoom-out'),
                            $zoomIn: $('.course-zoom-in')
                            //relative: true,
                            //minScale: 1
                        });

                        $panZoom.on('panzoomzoom', function (e, panzoom, matrix, changed) {
                            if (changed) {
                                elem.find('.course-zoom-level').text(Math.round(100 * matrix) + '%');
                            }
                        });

                        $panZoom.parent().on('mousewheel.focal', function (e) {
                            e.preventDefault();
                            var delta = e.delta || e.originalEvent.wheelDelta;

                            var down = delta ? delta < 0 : e.originalEvent.deltaY > 0;
                            $panZoom.panzoom('pan', 0, 15 * (down ? -1 : 1), { relative: true });
                        });

                        elem.find('.course-media-frame .loading').hide();
                    };
                    elem.find("img.course-pdf-preview").one("load", pdfPreviewLoaded).each(function () {
                        if (this.complete) $(this).load();
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

        .directive("courseQuestionsContainer", function($state) {
            return {
                restrict: "C",
                templateUrl: "/app/spa/course/CourseQuestions.html",
                scope: true,
                link: function($scope, elem, attrs) {
                    $scope.next = function() {
                        $state.go("test");

                        return false;
                    };


                    $('.js-magnify').magnificPopup({
                        type: 'image',
                        mainClass: 'mfp-pdf'
                    });

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