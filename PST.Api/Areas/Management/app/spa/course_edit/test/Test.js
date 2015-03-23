"use strict";

(function () {

    angular.module('pct.management.courseEdit.test', [
    ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('courseEdit.test', {
                    url: '/test',
                    templateUrl: "Areas/Management/app/spa/course_edit/test/Test.html",
                    controller: "courseEdit.test.Ctrl"
                })
            ;
        })

        .controller("courseEdit.test.Ctrl", function ($scope, $stateParams, QuestionService) {
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
                }
            });
            
            
            QuestionService.getList($stateParams.courseId).success(function(questions) {
                $scope.questionsMaster = questions;
                $scope.questions = ObjectUtil.clone(questions);
            });
        })
    ;

})();