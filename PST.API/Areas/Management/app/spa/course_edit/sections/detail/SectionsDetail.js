"use strict";

(function () {

    angular.module('pct.management.courseEdit.sections.detail', [
            'pct.management.courseEdit.questions'
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
                            $scope.questionsMaster = questions;
                            $scope.questions = ObjectUtil.clone(questions);
                        });
                    }
                }
            });

            QuestionService.getList($stateParams.courseId, $stateParams.sectionId).success(function(questions) {
                $scope.questionsMaster = questions;
                $scope.questions = ObjectUtil.clone(questions);
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
            
        })
        
    ;

})();