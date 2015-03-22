"use strict";

(function () {

    angular.module('pct.management.courseEdit.questions', [
    ])
        .directive("pctQuestions", function() {
            return {
                restrict: "E",
                templateUrl: "/Areas/Management/app/spa/course_edit/questions/Questions.html",
                scope: {
                    questions: "="
                },
                link: function($scope, elem, attrs) {
                    function addQuestion(questionType) {
                        $scope.questions.push({
                            question_type: questionType
                        });
                        $scope.questionsView.expandeds[$scope.questions.length - 1] = true;
                    }

                    $scope.addTextQuestion = function() {
                        addQuestion(3);
                    };
                    $scope.addMultiImagesQuestion = function() {
                        addQuestion(1);
                    };
                    $scope.addImageQuestion = function() {
                        addQuestion(0);
                    };

                    $scope.updateOrder = function(indice) {
                        var newQuestions = [];
                        for (var i = 0; i < indice.length; i++) {
                            var index = indice[i];
                            newQuestions.push($scope.questions[index]);
                        }
                        $scope.questions = newQuestions;
                    };

                    $scope.questionsView = {
                        expandeds: {}
                    };

                    $scope.expandAll = function() {
                        for (var i in $scope.questions) {
                            $scope.questionsView.expandeds[i] = true;
                        }
                    };
                    $scope.collapseAll = function() {
                        ObjectUtil.clear($scope.questionsView.expandeds);
                    }
                }
            };
        })
    
        .directive("questionRow", function(Fancybox, $parse) {
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

                    $scope.$watch(attrs.expanded, function(value) {
                        if (value) {
                            elem.addClass("expanded");
                            elem.removeClass("hovered");
                            elem.find('.table-row-expand').slideDown(200);
                        } else {
                            elem.removeClass("expanded");
                            //elem.addClass("hovered");
                            elem.find('.table-row-expand').slideUp(200);
                        }
                    });

                    var expandedModel = $parse(attrs.expanded);
                    //var sliding = false;
                    elem.find('.col-size-1, .icon-chevron-down, .icon-chevron-up').on('click', function (e) {
                        var currentExpanded = expandedModel($scope);
                        if ($(this).hasClass("table-col") && currentExpanded) {
                            return;
                        }
                        if (currentExpanded) {
                            elem.addClass("hovered");
                        }
                        $scope.$applyAsync(function() {
                            expandedModel.assign($scope, !currentExpanded && true);
                        });
                    });

                    $scope.deleteQuestion = function() {
                        Cols.remove($scope.question, $scope.questions);
                    };
                    
                    $scope.openAnswersModel = function() {
                        var scope = $scope.$new(true);
                        scope.question_text = $scope.question.question_text;
                        var questionType = $scope.question.question_type;
                        scope.question_type = questionType;
                        scope.index = $scope.$index;
                        
                        scope.options = ObjectUtil.clone($scope.question.options || []);
                        scope.saveAction = function() {
                            $scope.question.options = ObjectUtil.clone(scope.options);
                        };
                        Fancybox.open(scope, {
                            templateUrl: "/Areas/Management/app/spa/course_edit/questions/popup-edit-answers.html",
                            width: (questionType==1 || questionType==3) ? 647 : 720,
                            controller: "courseEdit.questions.AnswersModalCtrl"
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
        
        .controller("courseEdit.questions.AnswersModalCtrl", function($scope, $q, $modalInstance, QuestionService) {
            $scope.cancel = $modalInstance.close;
            
            $scope.addOption = function() {
                $scope.options.push({});
            };
            $scope.addImageOptions = function(images) {
                var promises = [];
                for (var i = 0; i < images.length; i++) {
                    var image = images[i];
                    promises.push(QuestionService.uploadImage(image));
                }
                $q.all(promises).then(function(resps) {
                    for (var i = 0; i < resps.length; i++) {
                        var resp = resps[i];

                        var url = resp.data;

                        url = url.replace(/C:\\inetpub\\wwwroot\\gie-test.prototype1.io\\Content\\Images\\/, "Images/");
                        $scope.options.push({
                            image: url
                        });
                    }
                });
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