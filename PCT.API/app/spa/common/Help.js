"use strict";

(function () {

    angular.module('pct.help', [
    ])

        .directive("helpContainer", ["$http", "$templateCache", function($http, $templateCache) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {

                    var templatePromise = $http.get(attrs.helpContainer, {cache: $templateCache}).then(function (result) {return result.data;});

                    templatePromise.then(function(content) {
                        elem.html(content);

                        elem.find('.popup[step] button').click(function () {
                            var thisStep = $(this).closest('.popup[step]');
                            var stepNum = parseInt(thisStep.attr('step'));
                            thisStep.removeClass('open');
                            var nextStep = elem.find('.popup[step="' + (stepNum + 1) + '"]:visible');
                            if (nextStep.length == 1) {
                                nextStep.addClass('open');
                            } else {
                                elem.remove();
                            }
                        });

                        var $alreadyOpen = null;
                        elem.find('.help-wrapper button').click(function () {
                            if (!$alreadyOpen || $alreadyOpen.length > 0) {
                                if (!elem.find('#helpClose').hasClass('open')) {
                                    $alreadyOpen = elem.find('.popup.open');
                                }
                                $alreadyOpen.toggle();
                            }
                            elem.find('#helpClose').toggleClass('open');
                        });
                        elem.find('#helpClose button').click(function () {
                            elem.remove();
                        });
                        elem.find('#helpClose button.no').click(function () {
                            $scope.$apply(attrs.helpDisable);
                        });
                    });


                }
            };
        }])
    ;

})();