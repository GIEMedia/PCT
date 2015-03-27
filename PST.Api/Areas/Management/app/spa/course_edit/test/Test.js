"use strict";

(function () {

    angular.module('pct.management.courseEdit.test', [
    ])

        .config(["$stateProvider", function ($stateProvider) {
            $stateProvider
                .state('courseEdit.test', {
                    url: '/test?focusQuestion',
                    templateUrl: "Areas/Management/app/spa/course_edit/test/Test.html",
                    controller: "courseEdit.test.Ctrl"
                })
            ;
        }])

        .controller("courseEdit.test.Ctrl", ["$scope", "$stateParams", "QuestionService", function ($scope, $stateParams, QuestionService) {
            $scope.setCel({
                step: 2,
                needSaving: function() {
                    return $scope.questionsMaster == null ? false : !ObjectUtil.equals($scope.questions, $scope.questionsMaster);
                },
                save: function() {
                    return QuestionService.upsert($stateParams.courseId, null, $scope.questions).success(function(questions) {
                        $scope.questionsMaster = questions;
                        $scope.questions = ObjectUtil.clone(questions);
                    });
                },
                reset: function() {
                    $scope.questions = ObjectUtil.clone($scope.questionsMaster);
                }
            });

            $scope.t = {
                focusQuestions: $stateParams.focusQuestion == null ? null : [$stateParams.focusQuestion]
            };
            
            QuestionService.getList($stateParams.courseId).success(function(questions) {
                $scope.questionsMaster = questions;
                $scope.questions = ObjectUtil.clone(questions);
            });
        }])
    ;
})();