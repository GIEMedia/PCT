"use strict";

(function () {

    angular.module('pct.elearning.course', [
        'ui.router'
    ])

        .config(function ($stateProvider) {

            $stateProvider
                .state('course', {
                    url: '/course',
                    templateUrl: "/app/spa/course/Course.html",
                    controller: "course.Ctrl"
                })
            ;
        })

        .controller("course.Ctrl", function ($scope) {

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

            $("img.course-pdf-preview").one("load", pdfPreviewLoaded).each(function () {
                if (this.complete) $(this).load();
            });
        })

        .directive("courseQuestionsContainer", function() {
            return {
                restrict: "C",
                templateUrl: "/app/spa/course/CourseQuestions.html",
                scope: true,
                link: function($scope, elem, attrs) {
                    $scope.next = function() {
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