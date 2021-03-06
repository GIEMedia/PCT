"use strict";

(function () {

    angular.module('pct.management.courseEdit.sections.detail', [
            'pct.management.courseEdit.questions'
    ])

        .config(["$stateProvider", function ($stateProvider) {
            $stateProvider
                .state('courseEdit.sections.detail', {
                    url: '/:sectionId?focusQuestion',
                    templateUrl: "Areas/Management/app/spa/course_edit/sections/detail/SectionsDetail.html?v=" + htmlVer,
                    controller: "courseEdit.sections.detail.Ctrl"
                })
            ;
        }])

        .controller("courseEdit.sections.detail.Ctrl", ["$scope", "$state", "$stateParams", "QuestionService", function ($scope, $state, $stateParams, QuestionService) {
            
            $scope.setCel({
                step: 1,
                backButton: {
                    title: "Sections",
                    state: "^.list"
                },
                needSaving: function() {
                    return $scope.questionsMaster == null ? false : !ObjectUtil.equals($scope.questions, $scope.questionsMaster);
                },
                save: function() {
                    return QuestionService.upsert($stateParams.courseId, $stateParams.sectionId, $scope.questions).success(function(questions) {
                        $scope.questionsMaster = questions;
                        $scope.questions = ObjectUtil.clone(questions);

                        // Update questions count
                        $scope.sections[$scope.sectionIndex()].num_questions = questions.length;
                    });
                },
                reset: function() {
                    $scope.questions = ObjectUtil.clone($scope.questionsMaster);
                }
            });

            $scope.sd = {
                focusQuestions: $stateParams.focusQuestion == null ? null : [$stateParams.focusQuestion]
            };

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
        }])
    ;
})();