"use strict";

(function () {

    angular.module('pct.management.courseEdit.questions', [
    ])
        .directive("pctQuestions", function() {
            return {
                restrict: "E",
                templateUrl: "Areas/Management/app/spa/course_edit/questions/Questions.html",
                scope: {
                    questions: "=",
                    focus: "=",
                    readonly: "="
                },
                link: function($scope, elem, attrs) {
                    $scope.expandeds = {};

                    if (Cols.isNotEmpty($scope.focus)) {
                        $scope.$watch("questions", function(value) {
                            if (value) {
                                for (var i = 0; i < $scope.questions.length; i++) {
                                    var question = $scope.questions[i];
                                    if ($scope.focus.indexOf(question.id) > -1) {
                                        $scope.expandeds[i] = true;
                                    }
                                }
                            }
                        });
                    }

                    function addQuestion(questionType) {
                        $scope.questions.push({
                            question_type: questionType
                        });
                        $scope.expandeds[$scope.questions.length - 1] = true;
                        setTimeout(function() {
                            window.scrollTo(0,document.body.scrollHeight);
                        }, 200); // 200 for animations to finish
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
                    };

                    $scope.expandAll = function() {
                        for (var i in $scope.questions) {
                            $scope.expandeds[i] = true;
                        }
                    };
                    $scope.collapseAll = function() {
                        ObjectUtil.clear($scope.expandeds);
                    }
                }
            };
        })
    
        .directive("questionRow", ["Fancybox", "$parse", "QuestionService", function(Fancybox, $parse, QuestionService) {
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
                        scope.readonly = $scope.readonly;

                        scope.question_text = $scope.question.question_text;
                        var questionType = $scope.question.question_type;
                        scope.question_type = questionType;
                        scope.index = $scope.$index;

                        scope.question_image = $scope.question.image;
                        scope.question_video = $scope.question.video ? $scope.question.video.mp4 : null;

                        scope.options = ObjectUtil.clone($scope.question.options || []);
                        scope.saveAction = function() {
                            $scope.question.options = ObjectUtil.clone(scope.options);

                            $scope.question.image = scope.question_image;
                            $scope.question.video = scope.question_video ? {mp4: scope.question_video} : null;

                            if (scope.question_image != null) {
                                $scope.question.question_type = 0;
                            } else if (scope.question_video != null) {
                                $scope.question.question_type = 2;
                            }
                        };
                        Fancybox.open(scope, {
                            templateUrl: "Areas/Management/app/spa/course_edit/questions/popup-edit-answers.html",
                            width: (questionType==1 || questionType==3) ? 647 : 720,
                            controller: "courseEdit.questions.AnswersModalCtrl"
                        });
                    };
                    
                    $scope.isEmpty = QuestionService.isEmpty;

                    $scope.ellipsis = function(value, ellipsisMax) {
                        if (value == null) {
                            return null;
                        }
                        if (value.length > ellipsisMax) {
                            return value.substring(0, ellipsisMax - 3) + "...";
                        }
                        return value;
                    };

                    $scope.isMultipleCorrect = function(question) {
                        if (question.options==null) {
                            return false;
                        }

                        return Cols.filter(question.options, function(o) {
                            return o.correct;
                        }).length >= 2;
                    };
                }
            };
        }])
        
        .controller("courseEdit.questions.AnswersModalCtrl", ["$scope", "$q", "$modalInstance", "QuestionService", function($scope, $q, $modalInstance, QuestionService) {
            $scope.view = {
                addVideo: {
                    url: null,
                    show: false
                }
            };

            $scope.addVideo = function() {
                $scope.question_video = $scope.view.addVideo.url;
                if ($scope.question_video) {
                    $scope.question_image = null;
                    $scope.question_type = 2;
                }
                $scope.view.addVideo.show = false;
            };
            $scope.cancel = $modalInstance.close;
            
            $scope.addOption = function() {
                if ($scope.options == null || $scope.options.length >= 6) {
                    return;
                }
                $scope.options.push({});
            };
            $scope.addImageOptions = function(images) {
                if (images == null || $scope.options == null) {
                    return;
                }
                if (images.length + $scope.options.length > 6) {
                    alert("We don't support more than 6 options");
                    return;
                }
                var promises = [];
                for (var i = 0; i < images.length; i++) {
                    var image = images[i];
                    promises.push(QuestionService.uploadImage(image));
                }
                $q.all(promises).then(function(resps) {
                    for (var i = 0; i < resps.length; i++) {
                        var resp = resps[i];

                        var url = resp.data;

                        $scope.options.push({
                            image: url
                        });
                    }
                });
            };
            $scope.addQuestionImage = function(image) {
                QuestionService.uploadQuestionImage(image).success(function(resp) {
                    var url = resp;

                    //url = url.replace(/C:\\inetpub\\wwwroot\\gie-test.prototype1.io\\Content\\Images\\/, "Images/");
                    $scope.question_image = url;
                    $scope.question_video = null;
                    $scope.question_type = 0;
                });
            };
            $scope.deleteOption = function(o) {
                Cols.remove(o, $scope.options);
            };
            
            $scope.save = function() {
                $scope.saveAction();
                $modalInstance.close();
            }
        }])

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

        .directive("btnPlusMain", ["Hover", function(Hover) {
            return {
                restrict: "C",
                link: Hover.link
            };
        }])

        .directive("btnPlusInner", ["Hover", function(Hover) {
            return {
                restrict: "C",
                link: Hover.link
            };
        }])

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

        .directive("pctVideo", function() {
            return {
                restrict: "E",
                link: function($scope, elem, attrs) {
                    $scope.$watch(attrs.src, function(value) {
                        if (value) {
                            elem.html("<video class=\"video-js vjs-default-skin\" controls preload=\"auto\" width=\"" + attrs.width + "\" height=\"" + attrs.height + "\">" +
                            "<source src=\"" + value + "\">" + // type='video/mp4'
                            "<p class=\"vjs-no-js\">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href=\"http://videojs.com/html5-video-support/\" target=\"_blank\">supports HTML5 video</a></p>" +
                            "</video>");
                        } else {
                            elem.html("");
                        }
                    });
                }
            };
        })
    ;

})();