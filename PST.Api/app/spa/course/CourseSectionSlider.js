"use strict";

(function () {

    angular.module('pct.elearning.course.slider', [
    ])

        .directive("courseStepsSlides", function() {
            return {
                restrict: "C",
                require: "^course",
                link: function($scope, elem, attrs, courseCtrl) {
                    var tooltip = function(e, text) {
                        return e.tooltipster({
                            position: 'right',
                            maxWidth: 230,
                            functionBefore: function(origin, continueTooltip) {
                                origin.tooltipster('content', text);
                                continueTooltip();
                            }
                        });
                    };
                    var isAnswered = function(sectionNum) {
                        return function() {
                            if ($scope.userProgress == null || $scope.course == null) {
                                return false;
                            }
                            var progress = $scope.userProgress.sections[sectionNum - 1];
                            return progress >= $scope.course.sections[sectionNum - 1].questions.length;
                        };
                    };

                    var setClass = function(className, e) {
                        return function(set) {
                            if (set && !e.hasClass(className)) {
                                e.addClass(className);
                            } else if (!set && e.hasClass(className)) {
                                e.removeClass(className);
                            }
                        };
                    };

                    var current = null;

                    var tags = null;
                    $scope.$watch("course", function(course) {
                        if (course) {
                            tags = [];
                            elem.empty();
                            for (var i = 0; i < course.sections.length; i++) {
                                var section = course.sections[i];
                                var aTag = tooltip($("<a href=\"\" class=\"answered\" ></a>").text(i + 1), section.title);
                                elem.append($("<li/>").append(
                                    aTag
                                ));
                                aTag.click(function() {
                                    var tag = $(this);
                                    if (tag.hasClass("current")) {
                                        ;
                                    } else {
                                        courseCtrl.gotoSection(tag.text()*1);
                                    }
                                    return false;
                                });
                                tags.push(aTag);

                                $scope.$watch(isAnswered(i+1), setClass("answered", aTag));
                            }
                        }
                    });

                    $scope.$watch("section", function(section) {
                        var indexOf = $scope.course.sections.indexOf($scope.section);
                        if (indexOf == -1) {
                            return;
                        }
                        var newCurrent = tags[indexOf];

                        if (newCurrent != current) {
                            newCurrent.addClass("current");
                            if (current != null) {
                                current.removeClass("current");
                            }
                            current = newCurrent;
                        }
                    });
                }
            };
        })

        .directive("courseSteps", function() {
            return {
                restrict: "C",
                require: "^course",
                scope : true,
                link: function($scope, elem, attrs, courseCtrl) {
                    $scope.prevSection = function() {
                        courseCtrl.prevSection();
                        return false;
                    };
                    $scope.nextSection = function() {
                        courseCtrl.nextSection();
                        return false;
                    };
                }
            };
        })

    ;

})();