"use strict";

(function () {

    angular.module('pct.elearning.course.question', [
    ])
        /**
         * Display 1 question in course page. Allow user to submit answer (delegate to courseQuestionsContainerCtrl)
         */
        .directive("courseQuestion", function() {
            return {
                restrict: "E",
                templateUrl: "app/spa/course/questions-viewer/question.html?v=" + htmlVer,
                scope: {
                    question: "=",
                    checkAnswer: "=",
                    onAnswerCorrect: "&",
                    letControl: "=control"
                },
                controller: ["$scope", function($scope) {
                    $scope.view = {
                        submitting: false
                    };

                    $scope.$watch("question", function(question) {
                        if (question) {
                            $scope.answer = [];
                        }
                    });

                    $scope.$watch("answer", function(value) {
                        if ($scope.result != null && !$scope.result.passed) {
                            $scope.result = null;
                        }
                    });

                    $scope.letControl = {
                        result: function() {
                            return $scope.result;
                        }
                    };

                    // Extract the answer and submit to question container
                    $scope.submitAnswer = function() {
                        $scope.view.submitting = true;
                        $scope.checkAnswer($scope.question.question_id, $scope.answer).then(function(result) {
                            $scope.result = result;
                            $scope.view.submitting = false;

                            if (result.correct) {
                                $scope.onAnswerCorrect();
                            }
                        });
                        return false;
                    };
                }]
            };
        })

        /**
         * Display 1 question's options. Used in both course page and test page.
         */
        .directive("eOptions", function() {
            //function isIE() {
            //    var ua = window.navigator.userAgent;
            //    return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
            //}

            return {
                restrict: "E",
                scope: {
                    "question": "=",
                    "answer": "=",
                    "retry": "=",
                    "disabled": "=",
                    "highlightCorrect": "&"
                },
                templateUrl: "/app/spa/course/questions-viewer/eOptions.html?v=" + htmlVer,
                link: function($scope, elem, attrs) {
                    $scope.view = {
                        answer : []
                    };

                    // This is to workaround IE bug not selecting
                    $scope.choose = function(index, $event) {
                        if ($scope.question.multi_select) {
                            $scope.view.answer[index] = !$scope.view.answer[index];
                            $event.preventDefault();
                            return false;
                        } else {
                            $scope.view.answer[0] = $scope.question.options[index].option_id;
                        }
                    };

                    var extractAnswer = function() {
                        if ($scope.question==null) {
                            return "[]";
                        }

                        if ($scope.question.multi_select) {
                            var answer = [];
                            for (var i = 0; i < $scope.view.answer.length; i++) {
                                if ($scope.view.answer[i]) {
                                    answer.push($scope.question.options[i].option_id);
                                }
                            }
                            return JSON.stringify(answer);
                        } else {
                            return JSON.stringify($scope.view.answer);
                        }
                    };

                    $scope.$watch("question", function(value) {
                        $scope.view.answer = [];
                    });
                    $scope.$watch(extractAnswer, function(value) {
                        $scope.answer = JSON.parse(value);
                    });
                    $scope.$watch("answer", function(value) {
                        if ($scope.question == null && Cols.isEmpty(value)) {
                            return;
                        }
                        if ($scope.question.multi_select) {
                            $scope.view.answer = [];

                            var answer = [];
                            for (var i = 0; i < $scope.question.options.length; i++) {
                                answer[i] = value.indexOf($scope.question.options[i].option_id) > -1;
                            }
                            $scope.view.answer = answer;
                        } else {
                            $scope.view.answer = value;
                        }
                    });

                    if (attrs.resetOn) {
                        Cols.each(attrs.resetOn.split(/, */), function(on) {
                            $scope.$watch(on, function() {
                                $scope.reset();
                            });
                        })
                    }
                    $scope.magnifyClass = attrs.magnifyClass;

                    $scope.isHighlightCorrect = function(option) {
                        return $scope.highlightCorrect({"$option": option});
                    };
                },
                controller: ["$scope", function($scope) {
                    var _resetFuncs = [];

                    var ctrl = this;

                    ctrl.registerResetFunc = function(resetFunc) {
                        _resetFuncs.push(resetFunc);

                        return function() {
                            Cols.remove(resetFunc, _resetFuncs);
                        };
                    };
                    ctrl.magnifyClass = function() {
                        return $scope.magnifyClass;
                    };

                    $scope.reset = function() {
                        Fs.invokeAll(_resetFuncs);
                    };
                }]
            };
        })

        // The magnify button in each pictured question option
        .directive("optionMagnify", function() {
            return {
                restrict: "A",
                require: "^eOptions",
                link: function($scope, elem, attrs, eOptionsCtrl) {
                    var popup = elem.magnificPopup({
                        type: 'image',
                        mainClass: eOptionsCtrl.magnifyClass
                    });

                    var deregister = eOptionsCtrl.registerResetFunc(function() {
                        popup.magnificPopup("close");
                    });

                    $scope.$on("$destroy", function() {
                        deregister();
                        popup.magnificPopup("close");
                    });
                }
            };
        })

        // The magnify button in each pictured question option
        .directive("questionMagnify", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    var popup = elem.magnificPopup({
                        type: 'image',
                        mainClass: attrs.questionMagnify
                    });

                    if (attrs.closeOn) {
                        Cols.each(attrs.closeOn.split(/, */), function(on) {
                            $scope.$watch(on, function() {
                                popup.magnificPopup("close");
                            });
                        })
                    }

                    $scope.$on("$destroy", function() {
                        popup.magnificPopup("close");
                    });
                }
            };
        })
    ;

})();