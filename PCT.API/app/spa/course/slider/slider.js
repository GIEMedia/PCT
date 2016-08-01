"use strict";

(function () {

    angular.module('pct.elearning.course.slider', [
    ])

        .directive("tooltipster", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    elem.tooltipster({
                        position: 'right',
                        maxWidth: 230,
                        functionBefore: function(origin, continueTooltip) {
                            origin.tooltipster('content', $scope.$eval(attrs.tooltipster));
                            continueTooltip();
                        }
                    });
                }
            };
        })

        .directive("courseStepsSlides", function() {
            return {
                restrict: "E",
                scope: {
                    sections: "=",
                    onChangeSection: "&",
                    isComplete: "=",
                    currentSection: "="
                },
                templateUrl: "app/spa/course/slider/slides-steps.html"
            };
        })

    ;

})();