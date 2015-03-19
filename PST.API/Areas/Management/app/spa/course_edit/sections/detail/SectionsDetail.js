"use strict";

(function () {

    angular.module('pct.management.courseEdit.sections.detail', [
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.sections.detail', {
                    url: '/:sectionId',
                    templateUrl: "/Areas/Management/app/spa/course_edit/sections/detail/SectionsDetail.html",
                    controller: "courseEdit.sections.detail.Ctrl"
                })
            ;
        })

        .controller("courseEdit.sections.detail.Ctrl", function ($scope, $state, $stateParams, QuestionService) {
            QuestionService.getList($stateParams.courseId, $stateParams.sectionId).success(function(questions) {
                $scope.questions = questions;
            });

            $scope.sectionIndex = function() {
                return Cols.indexOf($stateParams.sectionId, $scope.sections, function (s) {
                    return s.id;
                });
            };
            $scope.prevSection = function() {
                var sectionIndex = $scope.sectionIndex();
                if (sectionIndex==0) return;
                $state.go("^.detail", {sectionId: $scope.sections[sectionIndex - 1].id });
            };
            $scope.nextSection = function() {
                var sectionIndex = $scope.sectionIndex();
                if (sectionIndex==$scope.sections.length - 1) return;
                $state.go("^.detail", {sectionId: $scope.sections[sectionIndex + 1].id });
            };
        })

        .directive("customTableQuestions", function() {
            return {
                restrict: "C",
                link: function($scope, elem, attrs) {

                    elem.find('.table-row').on('mouseenter', function() {
                        if (!$(this).hasClass('expanded')) {
                            $(this).addClass('hovered');
                        }
                    }).on('mouseleave', function() {
                        $(this).removeClass('hovered');
                    });


                    elem.find('.table-row .table-col.col-size-1, .table-row .foot').on('mouseenter', function () {
                        $(this).addClass('hovered');
                    }).on('mouseleave', function () {
                        $(this).removeClass('hovered');
                    });


                    var sliding = false;
                    elem.find('.table-row .col-size-1, .icon-chevron-down, .icon-chevron-up').on('click', function (e) {
                        if (sliding) return;
                        if ($(this).hasClass('table-col') && $(this).closest('.table-row').hasClass('expanded')) return;
                        sliding = true;
                        $(this).parents('.table-row').toggleClass('expanded').toggleClass('hovered');
                        if ($(this).parents('.table-row').hasClass('expanded')) {
                            $(this).parents('.table-row').find('.table-row-expand').slideDown(200, function () { sliding = false; });
                        } else {
                            $(this).parents('.table-row').find('.table-row-expand').slideUp(200, function () { sliding = false; });
                        }
                        e.preventDefault();
                    });

                    elem.find('.answer-icons .fa-arrows').on('mousedown', function (e) {

                        $('.collapse-all').trigger('click');

                        e.preventDefault();
                    });
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

        .directive("btnPlusMain", function(Hover) {
            return {
                restrict: "C",
                link: Hover.link
            };
        })
        .directive("btnPlusInner", function(Hover) {
            return {
                restrict: "C",
                link: Hover.link
            };
        })
        .directive("btnPlus", function() {
            return {
                restrict: "C",
                link: function($scope, elem, attrs) {

                    elem.on('click', function () {
                        $(this).children('.btn-plus-main');
                        $(this).toggleClass('clicked');
                    });

                    $(document).mouseup(function (e) {
                        var container = $(".btn-plus");
                        if (container.has(e.target).length === 0) { container.find('.btn-plus-inner').parent().removeClass('clicked'); }
                    });

                }
            };
        })
    ;

})();