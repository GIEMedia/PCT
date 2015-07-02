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

                    var setClass = function(className, e) {
                        return function(set) {
                            if (set && !e.hasClass(className)) {
                                e.addClass(className);
                            } else if (!set && e.hasClass(className)) {
                                e.removeClass(className);
                            }
                        };
                    };

                    var currentTag = null;

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

                                var isCompleteWatcher = Fs.f0(function (sec) {
                                    return $scope.progress == null ? false : $scope.progress[sec.section_id] >= sec.questions.length;
                                }, section);
                                $scope.$watch(isCompleteWatcher, setClass("answered", aTag));
                            }
                        }
                    });

                    $scope.$watch("section", function(section) {
                        if (section==null) {
                            return;
                        }
                        var indexOf = $scope.course.sections.indexOf($scope.section);
                        if (indexOf == -1) {
                            return;
                        }
                        var newTag = tags[indexOf];

                        if (newTag != currentTag) {
                            newTag.addClass("current");
                            if (currentTag != null) {
                                currentTag.removeClass("current");
                            }
                            currentTag = newTag;
                        }
                    });
                }
            };
        })

    ;

})();