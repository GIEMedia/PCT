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
            $scope.sectionLayout({
                backButton: {
                    title: "Sections",
                    state: "^.list"
                },
                saving: {
                    needSaving: function() {
                        return !ObjectUtil.equals($scope.questions, $scope.questionsMaster);
                    },
                    save: function() {
                        return QuestionService.upsert($stateParams.courseId, $stateParams.sectionId, $scope.questions).success(function(questions) {
                            $scope.questions = questions;
                            $scope.questionsMaster = ObjectUtil.clone(questions);
                        });
                    }
                }
            });

            QuestionService.getList($stateParams.courseId, $stateParams.sectionId).success(function(questions) {
                $scope.questions = questions;
                $scope.questionsMaster = ObjectUtil.clone(questions);
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
            
            $scope.updateOrder = function(indice) {
                var newQuestions = [];
                for (var i = 0; i < indice.length; i++) {
                    var index = indice[i];
                    newQuestions.push($scope.questions[index]);
                }
                $scope.questions = newQuestions;
            };
            
            $scope.addTextQuestion = function() {
                console.log(11);
                $scope.questions.push({
                    question_type: 0
                });
            };
        })
        
        .directive("questionRow", function(Fancybox) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    elem.on('mouseenter', function() {
                        if (!$(this).hasClass('expanded')) {
                            $(this).addClass('hovered');
                        }
                    }).on('mouseleave', function() {
                        $(this).removeClass('hovered');
                    });
                    
                    
                    var sliding = false;
                    elem.find('.col-size-1, .icon-chevron-down, .icon-chevron-up').on('click', function (e) {
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
                    
                    
                    $scope.deleteQuestion = function() {
                        Cols.remove($scope.question, $scope.questions);
                    };
                    
                    $scope.openAnswersModel = function() {
                        var scope = $scope.$new(true);
                        scope.question_text = $scope.question.question_text;
                        scope.options = ObjectUtil.clone($scope.question.options || []);
                        scope.index = $scope.$index;
                        scope.saveAction = function() {
                            $scope.question.options = ObjectUtil.clone(scope.options);
                        };
                        Fancybox.open(scope, {
                            templateUrl: "/Areas/Management/app/spa/course_edit/sections/detail/popup-edit-text.html",
                            width: 647,
                            controller: "courseEdit.sections.detail.TextQuestionModalCtrl"
                        });
                    };
                    
                    $scope.isEmpty = function(question) {
                        return StringUtil.isBlank(question.question_text) 
                            && StringUtil.isBlank(question.response_heading) 
                            && StringUtil.isBlank(question.response_message) 
                            && StringUtil.isBlank(question.tip) 
                            && Cols.isEmpty(question.options) 
                    }
                }
            };
        })
        
        .controller("courseEdit.sections.detail.TextQuestionModalCtrl", function($scope, $modalInstance) {
            $scope.cancel = $modalInstance.close;
            
            $scope.addOption = function() {
                $scope.options.push({});
            };
            $scope.deleteOption = function(o) {
                Cols.remove(o, $scope.options);
            };
            
            $scope.save = function() {
                $scope.saveAction();
                $modalInstance.close();
            }
        })

        .directive("customTableQuestions", function() {
            return {
                restrict: "C",
                link: function($scope, elem, attrs) {

                    elem.find('.table-row .table-col.col-size-1, .table-row .foot').on('mouseenter', function () {
                        $(this).addClass('hovered');
                    }).on('mouseleave', function () {
                        $(this).removeClass('hovered');
                    });

                    elem.find('.answer-icons .fa-arrows').on('mousedown', function (e) {

                        $('.collapse-all').trigger('click');

                        e.preventDefault();
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
//                        $(this).children('.btn-plus-main');
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