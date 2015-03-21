"use strict";

(function () {

    angular.module('pct.management.courseEdit.sections', [
        'pct.management.courseEdit.sections.list',
        'pct.management.courseEdit.sections.detail'
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.sections', {
                    url: '/sections',
                    template: "<ui-view></ui-view>",
                    controller: "courseEdit.sections.Ctrl"
                })
            ;
        })

        .controller("courseEdit.sections.Ctrl", function ($scope, $state, SectionService) {
            var _backButton;
            var _needSaving;
            var _save;
            $scope.setCel({
                step: 1,
                backButton: function() {
                    return _backButton;
                },
                needSaving: function() {
                    return _needSaving != null && _needSaving();
                },
                save: function() {
                    return _save();
                }
            });


            $scope.$watch("course", function(course) {
                if (course) {
                    SectionService.getList(course.id).success(function(sections) {
                        $scope.sections = sections;
                    });
                }
            });

            $scope.sectionLayout = function(options) {
                _backButton = options.backButton == null ? null : {
                    title: options.backButton.title,
                    action: function() {
                        $state.go(options.backButton.state);
                    }
                };
                _needSaving = options.saving ? options.saving.needSaving : null;
                _save = options.saving ? options.saving.save : null;
            };

        })


        //.directive("iconRename", function() {
        //    return {
        //        restrict: "C",
        //        link: function($scope, elem, attrs) {
        //            elem.on('click', function (e) {
        //                var tr = elem.closest('tr');
        //                tr.addClass('editing');
        //                tr.find('.section-name .field').focus();
        //
        //                tr.find('.name-edit .fa').on('click', function (e) {
        //                    tr.removeClass('editing');
        //                    e.preventDefault();
        //                });
        //
        //                e.preventDefault();
        //            });
        //        }
        //    };
        //})
    ;

})();